const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Delete all existing admins to start fresh
    await Admin.deleteMany({ role: 'admin' });

    // Create the new admin - THE MODEL WILL HASH THIS AUTOMATICALLY
    const newAdmin = new Admin({
      username: "admin",
      email: "admin@zupply.de",
      password: "admin123", // Use plain text here
      role: "admin"
    });

    await newAdmin.save();
    console.log("✅ Admin 'admin' created with password 'admin123'");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

reset();