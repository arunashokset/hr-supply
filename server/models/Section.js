const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  sectionName: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  content: { type: String },
  layoutType: { type: String, default: 'standard' },
  mediaType: { type: String, default: 'none' },
  imagePosition: { type: String, default: 'top' },
  mediaPath: { type: String }, // Path to uploaded image/video
  showButton: { type: Boolean, default: false },
  buttonText: { type: String },
  formType: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Section', SectionSchema);