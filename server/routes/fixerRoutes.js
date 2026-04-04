const express = require('express');
const router = express.Router();
const Fixer = require('../models/Fixer'); // Import your Mongoose model

// --- 🛠️ 1. GET ALL WORKERS ---
// Replaces your hardcoded hrSupplies array with real data from MongoDB
router.get('/', async (req, res) => {
  try {
    const fixers = await Fixer.find().sort({ createdAt: -1 }); 
    res.json(fixers);
  } catch (err) {
    console.error("Error fetching fixers:", err.message);
    res.status(500).json({ message: "Server Error fetching fixers" });
  }
});

// --- 🛠️ 2. ADD A NEW WORKER (POST) ---
router.post('/', async (req, res) => {
  try {
    const newFixer = new Fixer(req.body);
    const savedFixer = await newFixer.save();
    res.status(201).json(savedFixer);
  } catch (err) {
    res.status(400).json({ message: "Failed to add fixer." });
  }
});

// --- 🛠️ 3. UPDATE PROFILE & PHOTO (PUT) ---
// This is the specific route your FixerDashboard.jsx calls
router.put('/update/:id', async (req, res) => {
  try {
    const { phone, location, photo, availableTimings } = req.body;

    const updatedFixer = await Fixer.findByIdAndUpdate(
      req.params.id,
      { 
        phone, 
        location, 
        photo, 
        availableTimings 
      },
      { new: true } // Returns the updated document to the frontend
    );

    if (!updatedFixer) {
      return res.status(404).json({ message: "Fixer not found" });
    }

    res.json(updatedFixer);
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: "Server Error updating profile" });
  }
});

module.exports = router;