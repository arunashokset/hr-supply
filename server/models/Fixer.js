const mongoose = require('mongoose');

const FixerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  rate: { type: Number, required: true },
  profession: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true }); // This adds createdAt and updatedAt automatically

const fixerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  exp: { type: String, required: true },  // e.g., "5 Years"
  loc: { type: String, required: true },  // e.g., "Nidda"
  rate: { type: String, required: true }  // e.g., "25€"
});

module.exports = mongoose.model('Fixer', FixerSchema);