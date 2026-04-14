// server/seed-admin.js
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. Delete the old, broken admin entries
    await Admin.deleteMany({ role: 'admin' });
    console.log("Old admin entries cleared.");

    // 2. Create a fresh admin using your Model
    // This will trigger the .pre('save') hook in your Admin.js to hash the password correctly
    const newAdmin = new Admin({
      username: "admin",
      email: "admin@zupply.de",
      password: "admin123", // Use PLAIN TEXT here; the model hashes it!
      role: "admin"
    });

    await newAdmin.save();
    console.log("✅ SUCCESS: Admin created with password 'admin123'");
    
    process.exit();
  } catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  }
};

seed();