// routes/profile.js - Profile management for authenticated buyers
// Viva Note: Allows commercial buyers to read and update their establishment details, GSTIN, and avatar.
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Buyer = require('../models/Buyer');

router.use(authMiddleware);

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

// GET /api/profile - Fetch current buyer profile without password
router.get('/', async (req, res, next) => {
  try {
    const buyer = await Buyer.findById(req.buyer.id).select('-password');
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer profile not found.' });
    }

    const resolvedContact =
      (buyer.contactPerson && buyer.contactPerson.trim() && buyer.contactPerson.trim() !== buyer.businessName)
        ? buyer.contactPerson.trim()
        : deriveContactPerson(buyer.email, buyer.businessName);

    return res.json({
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
        avatar: buyer.avatar,
        photo: buyer.avatar,
        photoPreview: buyer.avatar
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/profile - Update commercial buyer credentials
router.put('/', async (req, res, next) => {
  try {
    const {
      businessName,
      shopName,
      contactPerson,
      name,
      fullName,
      buyerType,
      phone,
      gstin,
      address,
      avatar,
      photo
    } = req.body;

    const buyer = await Buyer.findById(req.buyer.id);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer profile not found.' });
    }

    if (businessName || shopName) buyer.businessName = (businessName || shopName).trim();
    if (contactPerson || name || fullName) buyer.contactPerson = (contactPerson || name || fullName).trim();
    if (buyerType) buyer.buyerType = buyerType.trim();
    if (phone) buyer.phone = phone.trim();
    if (gstin !== undefined) buyer.gstin = gstin.trim();
    if (address) buyer.address = address.trim();
    if (avatar || photo) buyer.avatar = avatar || photo;

    await buyer.save();

    const resolvedContact =
      (buyer.contactPerson && buyer.contactPerson.trim() && buyer.contactPerson.trim() !== buyer.businessName)
        ? buyer.contactPerson.trim()
        : deriveContactPerson(buyer.email, buyer.businessName);

    return res.json({
      message: 'Profile updated successfully',
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
        avatar: buyer.avatar,
        photo: buyer.avatar,
        photoPreview: buyer.avatar
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
