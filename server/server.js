const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express(); 

// 3. Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 4. Import Route Files
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const fixerRoutes = require('./routes/fixerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const sectionRoutes = require('./routes/sectionRoutes');

// 5. Register/Mount the Routes
app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/fixers', fixerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/sections', sectionRoutes);

// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads', express.static('public/uploads'));
app.use('/media', express.static(path.join(__dirname, 'public/media')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

// 6. Base Route for Testing
app.get('/', (req, res) => {
  res.send('🚀 ZUPPLY API is running successfully!');
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));