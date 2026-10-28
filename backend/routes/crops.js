// routes/crops.js - Public produce catalog and consignment listings
// Viva Note: Anyone can query current farm produce without an account; filters match regional hubs and grades.
const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');

// GET /api/crops - List all available crops with optional filtering
// Query params: ?search=tomato&category=vegetables&grade=Grade A
router.get('/', async (req, res, next) => {
  try {
    const { search, category, grade } = req.query;
    const filter = {};

    // Filter by produce category
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Filter by quality grade
    if (grade && grade !== 'all') {
      if (grade === 'grade_a' || grade === 'Grade A') {
        filter.grade = 'Grade A';
      } else if (grade === 'grade_b' || grade === 'Grade B') {
        filter.grade = 'Grade B';
      } else if (grade === 'grade_c' || grade === 'Grade C') {
        filter.grade = 'Grade C';
      } else {
        filter.grade = grade;
      }
    }

    // Keyword search across English name, Tamil name, hub, and farmer name
    if (search && search.trim()) {
      const q = search.trim();
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: regex },
        { nameTa: regex },
        { hub: regex },
        { farmerName: regex }
      ];
    }

    const crops = await Crop.find(filter).sort({ createdAt: -1 });

    return res.json({
      count: crops.length,
      crops
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
