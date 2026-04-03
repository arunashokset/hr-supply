const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userPhoto: { type: String, default: 'https://via.placeholder.com/150' }, // URL to image
  location: { type: String, default: 'Nidda, Germany' },
  designation: { type: String }, // e.g., "Homeowner" or "Business Manager"
  reviewText: { type: String, required: true },
  rating: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);