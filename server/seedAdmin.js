const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const admin = new Admin({
      username: "admin",
      password: "admin123" // The hook will hash this!
    });
    await admin.save();
    console.log("Admin created successfully with hashed password!");
    process.exit();
  })
  .catch(err => console.log(err));