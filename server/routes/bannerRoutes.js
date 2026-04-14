const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Banner = require('../models/Banner');

// 1. Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/uploads/media'; // Renamed to 'media' to hold both
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// 2. UPDATED File filter to allow BOTH videos and images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video and image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // Increased to 100MB for larger videos
});

// --- ROUTES ---

// @route   GET /api/banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 }); 
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Server Error: Could not fetch banners" });
  }
});

// @route   POST /api/banners/add (Admin: Create New)
router.post('/add', upload.single('video'), async (req, res) => {
  try {
    const { title, subtitle, buttonText, showButton, alignment, contentType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Media file is required" });
    }

    const newBanner = new Banner({
      title,
      subtitle,
      buttonText: buttonText || 'Hire Now',
      alignment: alignment || 'center',
      contentType: contentType || 'video',
      // Convert string "true"/"false" from FormData to Boolean
      showButton: showButton === 'true' || showButton === true,
      videoUrl: `/uploads/media/${req.file.filename}` 
    });

    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (err) {
    console.error("Add Banner Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/banners/:id (Admin: Edit existing)
router.put('/:id', upload.single('video'), async (req, res) => {
  try {
    // If it's a FormData request (from Edit), data is in req.body but as strings
    const { title, subtitle, buttonText, showButton, alignment, contentType, isActive } = req.body;
    
    const updateData = {
      title,
      subtitle,
      buttonText,
      alignment,
      contentType,
      // Handle both boolean (JSON) and string (FormData)
      showButton: String(showButton) === 'true',
      isActive: String(isActive) === 'true'
    };

    // Only update videoUrl if a new file was actually uploaded
    if (req.file) {
      updateData.videoUrl = `/uploads/media/${req.file.filename}`;
    }

    const updated = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   DELETE /api/banners/:id
router.delete('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    // Delete the file from the server
    const filePath = path.join(__dirname, '..', 'public', banner.videoUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting banner" });
  }
});

module.exports = router;