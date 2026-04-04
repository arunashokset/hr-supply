const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Fixer = require('../models/Fixer');
const Booking = require('../models/Booking');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// GET all stats for Admin Dashboard
router.get('/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const fixerCount = await Fixer.countDocuments();
        const bookingCount = await Booking.countDocuments();
        res.json({ users: userCount, fixers: fixerCount, bookings: bookingCount });
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats" });
    }
});
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  
  if (admin && (await bcrypt.compare(password, admin.password))) {
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
});

module.exports = router;