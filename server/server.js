const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Initialize Dotenv and Connect to MongoDB
dotenv.config();
connectDB();

// 2. Initialize the Express App
const app = express(); 

// 3. Middleware
app.use(cors());

/** * ✅ CORRECTED HERE: 
 * Increased limit to 10mb to allow Base64 Photo strings.
 * Without this, you will get a "413 Payload Too Large" error.
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 4. Import Route Files
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const fixerRoutes = require('./routes/fixerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// 5. Register/Mount the Routes
app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/fixers', fixerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// 6. Base Route for Testing
app.get('/', (req, res) => {
  res.send('🚀 HR-SUPPLY API is running successfully!');
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));