const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // 1. Change 'mobile' to 'phone' to match your Login.jsx
  phone: { type: String, required: true }, 
  location: { type: String },
  // 2. Ensure 'user' is an allowed value in the enum
  role: { 
    type: String, 
    enum: ['user', 'fixer', 'admin'], 
    default: 'user' 
  }
});

module.exports = mongoose.model('User', UserSchema);