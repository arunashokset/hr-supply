const express = require('express');
const router = express.Router();
const Fixer = require('../models/Fixer');

// @route   GET /api/fixers
// @desc    Get all fixers from MongoDB
router.get('/', async (req, res) => {
  try {
    const fixers = await Fixer.find(); // This replaces your hardcoded array
    res.json(fixers);
  } catch (err) {
    res.status(500).json({ message: "Server Error fetching fixers" });
  }
});

// @route   POST /api/fixers
// @desc    Add a new fixer (useful for testing)
router.post('/add', async (req, res) => {
  try {
    const newFixer = new Fixer(req.body);
    const savedFixer = await newFixer.save();
    res.status(201).json(savedFixer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;