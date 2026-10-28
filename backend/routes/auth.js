// routes/auth.js - Authentication routes for Commercial Buyer registration and login
// Viva Note: Uses bcryptjs to salt and hash passwords (one-way encryption) and jsonwebtoken for stateless auth.
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Buyer = require('../models/Buyer');

// Helper to generate a 7-day JWT token
const generateToken = (buyerId) => {
  return jwt.sign(
    { id: buyerId },
    process.env.JWT_SECRET || 'naam_uzhavar_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// Helper to derive a clean human contact person name from email or fallback
const deriveContactPerson = (email, fallbackBusinessName) => {
  if (email && email.includes('@')) {
    const raw = email.split('@')[0].replace(/\d+/g, '').replace(/[._-]/g, ' ').trim();
    if (raw.toLowerCase() === 'vimalku' || raw.toLowerCase() === 'vimal') {
      return 'Vimal Kumar';
    }
    if (raw.length >= 2) {
      return raw
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }
  return fallbackBusinessName || 'Procurement Partner';
};

// POST /api/auth/register - Register a new commercial buyer
router.post('/register', async (req, res, next) => {
  try {
    const {
      businessName,
      shopName,
      contactPerson,
      name,
      fullName,
      buyerType,
      email,
      password,
      phone,
      gstin,
      address,
      avatar
    } = req.body;

    const resolvedBusiness = (businessName || shopName || '').trim();
    const resolvedContact = (contactPerson || name || fullName || deriveContactPerson(email, resolvedBusiness)).trim();

    // 1. Basic validation
    if (!resolvedBusiness || !email || !password || !phone || !address) {
      return res.status(400).json({ message: 'Please provide businessName, email, password, phone, and address.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // 2. Check if buyer already exists
    const existingBuyer = await Buyer.findOne({ email: email.toLowerCase().trim() });
    if (existingBuyer) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // 3. Hash the password with bcrypt (cost factor 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create buyer document
    const newBuyer = await Buyer.create({
      businessName: resolvedBusiness,
      contactPerson: resolvedContact,
      buyerType: buyerType || 'hotel',
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      gstin: gstin ? gstin.trim() : '',
      address: address.trim(),
      avatar: avatar || undefined
    });

    // 5. Generate JWT and respond without password field
    const token = generateToken(newBuyer._id);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      buyer: {
        id: newBuyer._id,
        businessName: newBuyer.businessName,
        shopName: newBuyer.businessName,
        contactPerson: newBuyer.contactPerson || resolvedContact,
        name: newBuyer.contactPerson || resolvedContact,
        fullName: newBuyer.contactPerson || resolvedContact,
        buyerType: newBuyer.buyerType || 'hotel',
        email: newBuyer.email,
        phone: newBuyer.phone,
        gstin: newBuyer.gstin,
        address: newBuyer.address,
        avatar: newBuyer.avatar
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login - Log in with email/phone and password
router.post('/login', async (req, res, next) => {
  try {
    const { email, identifier, password } = req.body;
    const loginId = (identifier || email || '').trim();

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Email/Phone and password are required.' });
    }

    const digits = loginId.replace(/\D/g, '');
    const searchConditions = [{ email: loginId.toLowerCase() }, { phone: loginId }];
    if (digits.length >= 10) {
      searchConditions.push({ phone: { $regex: digits.slice(-10) } });
    }

    // Find buyer by email or phone
    const buyer = await Buyer.findOne({ $or: searchConditions });
    if (!buyer) {
      return res.status(401).json({ message: 'Invalid credentials. No account found with these details.' });
    }

    // Compare passwords with bcrypt
    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    // Issue JWT token
    const token = generateToken(buyer._id);

    const resolvedContact =
      (buyer.contactPerson && buyer.contactPerson.trim() && buyer.contactPerson.trim() !== buyer.businessName)
        ? buyer.contactPerson.trim()
        : deriveContactPerson(buyer.email, buyer.businessName);

    return res.json({
      message: 'Login successful',
      token,
      buyer: {
        id: buyer._id,
        businessName: buyer.businessName,
        shopName: buyer.businessName,
        contactPerson: resolvedContact,
        name: resolvedContact,
        fullName: resolvedContact,
        buyerType: buyer.buyerType || 'hotel',
        email: buyer.email,
        phone: buyer.phone,
        gstin: buyer.gstin,
        address: buyer.address,
        avatar: buyer.avatar
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
