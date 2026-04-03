const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');

// Store OTPs temporarily in memory
let otpCache = {};

// @route   POST /api/bookings
// --- STEP 1: INITIAL REQUEST ---
router.post('/', async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    // 1. GENERATE OTP FIRST
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Save to DB
    const newBooking = new Booking({ ...req.body, status: 'requested' });
    const savedBooking = await newBooking.save();
    
    // 3. Store OTP in cache
    otpCache[savedBooking._id] = otp;

    // 4. Send SMS (Now 'otp' and 'phone' are defined)
    try {
        await sendSMS(phone, `Your HR-SUPPLY code is: ${otp}`);
    } catch (smsErr) {
        console.error("SMS failed but continuing:", smsErr.message);
    }

    // 5. Send Email
    try {
      await sendEmail({
        to: email,
        subject: 'Verify your HR-SUPPLY Booking',
        html: `<h3 style="color:#198754">Your Code: ${otp}</h3>`
      });
    } catch (mailErr) {
      console.error("Mail failed but continuing:", mailErr.message);
    }

    return res.status(201).json(savedBooking);

  } catch (err) {
    console.error("Database Save Error:", err);
    return res.status(500).json({ message: "Database error" });
  }
});

// --- STEP 2: VERIFICATION ---
router.post('/verify-otp', async (req, res) => {
  const { bookingId, otp } = req.body;

  try {
    if (otpCache[bookingId] === otp) {
      // 1. Find and update the booking
      const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'verified' }, { new: true });

      if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
      }

      // 2. Send SMS Confirmation (Now 'booking' is defined)
      try {
          const confirmationMsg = `Success! Your booking for ${booking.serviceTitle} in ${booking.location} is confirmed. We will contact you shortly.`;
          await sendSMS(booking.phone, confirmationMsg);
      } catch (smsErr) {
          console.error("Confirmation SMS failed:", smsErr.message);
      }

      // 3. SEND FINAL CONFIRMATION EMAIL
      await sendEmail({
        to: booking.email,
        cc: process.env.EMAIL_USER,
        subject: `✅ Booking Received: ${booking.serviceTitle}`,
        html: `
          <div style="font-family: sans-serif; border: 2px solid #198754; padding: 20px; border-radius: 10px;">
            <h2 style="color: #198754;">Booking Received and Recorded!</h2>
            <p>The following booking has been received and is now <b>Verified</b>:</p>
            <hr />
            <p><strong>Service:</strong> ${booking.serviceTitle}</p>
            <p><strong>Customer:</strong> ${booking.customerName}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            <p><strong>Location:</strong> ${booking.location}</p>
            <p><strong>Time:</strong> ${new Date(booking.dateTime).toLocaleString()}</p>
            <hr />
            <p style="font-size: 12px; color: #666;">HR-SUPPLY Team - Nidda / Gelnhausen</p>
          </div>
        `
      });

      delete otpCache[bookingId];
      res.status(200).json({ message: "Verified and Mails Sent!" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;