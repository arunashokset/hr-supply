const mongoose = require('mongoose');

const FixerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, default: "" },
  phone: { type: String, required: true },
  location: { type: String },
  role: { 
    type: String, 
    enum: ['fixer', 'admin', 'user'], 
    default: 'fixer' 
  },
  experience: Number,
  rate: Number,
  availableHours: Number,
  specializations: [String],
  isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Fixer', FixerSchema);
