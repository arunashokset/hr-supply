const express = require('express');
const router = express.Router();
const Fixer = require('../models/Fixer');

// @route   GET /api/fixers
// @desc    Get all fixers from MongoDB
router.get('/', async (req, res) => {
  try {
    // We use .sort({ createdAt: -1 }) to show the newest fixers first
    const fixers = await Fixer.find().sort({ createdAt: -1 }); 
    res.json(fixers);
  } catch (err) {
    console.error("Error fetching fixers:", err.message);
    res.status(500).json({ message: "Server Error fetching fixers" });
  }
});

// @route   POST /api/fixers (Removed '/add' to follow REST standards)
// @desc    Add a new fixer
router.post('/', async (req, res) => {
  try {
    const newFixer = new Fixer(req.body);
    const savedFixer = await newFixer.save();
    res.status(201).json(savedFixer);
  } catch (err) {
    console.error("Error saving fixer:", err.message);
    res.status(400).json({ message: "Failed to add fixer. Check your data format." });
  }
});

module.exports = router;