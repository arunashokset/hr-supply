const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Import all route files
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const fixerRoutes = require('./routes/fixerRoutes'); // <--- ADD THIS LINE
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();
connectDB();

const app = express(); 

// Middleware
app.use(cors());
app.use(express.json());

// 2. Register/Mount the routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/fixers', fixerRoutes); // <---  (Enables http://localhost:5000/api/fixers)
app.use('/api/services', serviceRoutes);// <---  (Enables http://localhost:5000/api/services)
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.get('/', (req, res) => {
  res.send('🚀 HR-SUPPLY API is running successfully!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


