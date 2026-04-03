const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  mobile: { 
    type: String, 
    required: true,  
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, // Ensures email@test.com and EMAIL@test.com match
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['customer', 'fixer', 'admin'], 
    default: 'customer',
    required: true 
  },
  location: { 
    type: String, 
    default: 'Nidda, Germany', // Updated to your current location
    required: true  
  },
  // Only relevant if role is 'fixer'
  experience: { 
    type: String, 
    default: '0 years' 
  },
  // Added to track if a fixer is currently available for work
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);