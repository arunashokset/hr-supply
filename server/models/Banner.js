// server/models/Banner.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  videoUrl: { type: String },
  contentType: { type: String, default: 'video' },
  alignment: { type: String, default: 'center' }, // Ensure this is here
  buttonText: { type: String, default: 'Hire Now' },
  showButton: { type: Boolean, default: true },    // Ensure this is here
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Banner', bannerSchema);
