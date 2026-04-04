const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Fixer = require('../models/Fixer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check BOTH collections for the email
    let user = await User.findOne({ email });
    let isFixer = false;

    if (!user) {
      user = await Fixer.findOne({ email });
      if (user) isFixer = true;
    }

    // 2. If still no user found
    if (!user) {
      return res.status(401).json({ message: "Account not found in HR-SUPPLY" });
    }

    // 3. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 4. Generate Token (Include Role)
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    res.json({ 
      token, 
      role: user.role, // "admin", "fixer", or "user"
      name: user.name 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
    const { role, email, password } = req.body;

    // 1. Check if email exists in either collection to prevent duplicates
    const userExists = await User.findOne({ email });
    const fixerExists = await Fixer.findOne({ email });

    if (userExists || fixerExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. Save to correct collection based on role
    if (role === 'fixer') {
      const newFixer = new Fixer({ 
        ...req.body, 
        password: hashedPassword,
        // Ensure numbers are stored as numbers, not strings
        experience: Number(req.body.experience),
        rate: Number(req.body.rate),
        availableHours: Number(req.body.availableHours)
      });
      await newFixer.save();
    } else {
      const newUser = new User({ 
        ...req.body, 
        password: hashedPassword,
        role: 'user' // Force role to user for security
      });
      await newUser.save();
    }

    res.status(201).json({ message: "Registered successfully" });

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;