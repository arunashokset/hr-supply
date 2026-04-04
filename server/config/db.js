const mongoose = require('mongoose');

const connectDB = async () => {
  // Sets strictQuery to prevent filter properties not in the schema from being used
  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Check if we are in a development environment before clearing models
    if (process.env.NODE_ENV === 'development') {
        // This helps during hot-reloading if your server restarts frequently
        mongoose.models = {}; 
        mongoose.modelSchemas = {};
    }

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;