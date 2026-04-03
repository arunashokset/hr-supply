const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Fixer = require('../models/Fixer');
const Booking = require('../models/Booking');

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

module.exports = router;