// middleware/auth.js - Protects private routes using JSON Web Tokens (JWT)
// Viva Note: Checks the "Authorization: Bearer <token>" header, verifies signature with JWT_SECRET,
// and attaches the decoded buyer ID to req.buyer.
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization required. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token missing. Access denied.' });
    }

    // Verify token validity and expiration (7 days)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'naam_uzhavar_secret_jwt_key_2026');
    req.buyer = decoded; // Contains { id: buyer._id }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid authentication token.' });
  }
};

module.exports = authMiddleware;
