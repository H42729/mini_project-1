// config/db.js - MongoDB database connection using Mongoose
// Viva Note: Mongoose connects Node.js to MongoDB using a connection URI string.
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/naam-uzhavar';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Ensure MongoDB is running locally on port 27017 or provide a valid MONGO_URI in .env');
    process.exit(1);
  }
};

module.exports = connectDB;
