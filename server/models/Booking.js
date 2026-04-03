// Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  serviceTitle: { type: String, required: true },
  fixer: { type: mongoose.Schema.Types.ObjectId, ref: 'Fixer', required: false }, // Link to the specific person
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default:'Customer'
  },
  customerName: { type: String },
  email: { type: String },
  phone: { type: String },
  location: { type: String, required: true },
  dateTime: { type: Date, required: true },
  duration: { type: String, required: true },
  category: { type: String },
  requirements: { type: String },
  status: {
    type: String,
    enum: ['requested','pending', 'confirmed', 'completed', 'cancelled'],
    default: 'requested'
  }
  // Temporarily commented out fields that aren't in your form yet
  // fixer: { type: mongoose.Schema.Types.ObjectId, ref: 'Fixer' },
  // totalAmount: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);