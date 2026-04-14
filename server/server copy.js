const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express(); 

// 1. SPECIFIC CORS CONFIGURATION
// Standard app.use(cors()) sometimes fails with complex multipart/form-data
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 2. INCREASE LIMITS FOR VIDEO UPLOADS
// Since you are uploading videos, 10mb might be too small
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. STATIC FOLDERS
// Ensure this path is absolutely correct for the frontend to reach images/videos
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/media', express.static(path.join(__dirname, 'public/media')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const fixerRoutes = require('./routes/fixerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const sectionRoutes = require('./routes/sectionRoutes');


app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/fixers', fixerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/sections', sectionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));