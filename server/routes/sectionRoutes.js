const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Section = require('../models/Section');

// 🟢 STEP 1: Define Absolute Paths for Media and Videos
const mediaDir = path.join(process.cwd(), 'public/media');
const videoDir = path.join(process.cwd(), 'public/videos');

// Ensure directories exist
[mediaDir, videoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 🟢 STEP 2: Dynamic Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine folder based on file type
    if (file.mimetype.startsWith('video/')) {
      cb(null, videoDir);
    } else {
      cb(null, mediaDir);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // Increased to 100MB for better video support
});

// 🟢 ROUTES
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find().sort({ order: 1 });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/add', upload.single('media'), async (req, res) => {
  try {
    const sectionData = { ...req.body };
    
    if (req.file) {
      // Store the relative path matching your server.js static routes
      const folder = req.file.mimetype.startsWith('video/') ? 'videos' : 'media';
      sectionData.mediaPath = `/${folder}/${req.file.filename}`;
    }

    const newSection = new Section(sectionData);
    const savedSection = await newSection.save();
    res.status(201).json(savedSection);
  } catch (err) {
    console.error("POST Error:", err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', upload.single('media'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      const folder = req.file.mimetype.startsWith('video/') ? 'videos' : 'media';
      updateData.mediaPath = `/${folder}/${req.file.filename}`;
    }

    const updatedSection = await Section.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedSection);
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Section.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;