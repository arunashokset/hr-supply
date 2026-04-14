const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Fixer = require('../models/Fixer');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Username/Email and Password are required" });
    }

    // 1. Unified Search: Check Admin collection first
    let account = await Admin.findOne({ 
      $or: [{ email: identifier }, { username: identifier }] 
    });

    if (!account) {
      account = await User.findOne({ email: identifier });
    }

    if (!account) {
      account = await Fixer.findOne({ email: identifier });
    }

    // 2. Validate existence
    if (!account) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Verify Password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: account._id, role: account.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    // 5. Success Response
    // We send the 'role' so the frontend can redirect to /admin-dashboard or /userhome
    res.json({ 
      token, 
      role: account.role, 
      user: {
        id: account._id,
        name: account.name || account.username,
        email: account.email
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  try {
    const { role, email, password } = req.body;

    // 1. Global Email Check
    const exists = await Promise.all([
      Admin.findOne({ email }),
      User.findOne({ email }),
      Fixer.findOne({ email })
    ]);

    if (exists.some(acc => acc !== null)) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // 2. Save User - Password hashing is handled by Model hooks
    let newUser;
    if (role === 'fixer') {
      newUser = new Fixer({ 
        ...req.body, 
        experience: Number(req.body.experience) || 0,
        rate: Number(req.body.rate) || 0,
        availableHours: Number(req.body.availableHours) || 0
      });
    } else if (role === 'admin') {
      // Allow admin registration only if your app needs it; usually admins are seeded.
      newUser = new Admin({ ...req.body });
    } else {
      newUser = new User({ ...req.body, role: 'user' });
    }

    await newUser.save();
    res.status(201).json({ message: "Account created successfully" });

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Registration failed: " + err.message });
  }
});

module.exports = router;