const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Fixer = require('../models/Fixer');

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password, mobile, location, role } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create new user (Role defaults to 'customer' unless you send 'fixer')
    user = new User({
      name,
      email,
      password: hashedPassword, // Make sure you have bcrypt logic here!
      mobile,
      location,
      role: role || 'customer'
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET all fixers
router.get('/fixers', async (req, res) => {
    const fixers = await Fixer.find();
    res.json(fixers);
});

// DELETE a fixer
router.delete('/fixers/:id', async (req, res) => {
    await Fixer.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
});

// ADD a fixer
router.post('/fixers', async (req, res) => {
    const newFixer = new Fixer(req.body);
    await newFixer.save();
    res.json(newFixer);
});

module.exports = router;