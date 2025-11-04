const mongoose = require("mongoose");

const connectDB = async (req, res, next) => {
  try {
    // If already connected, move to next middleware
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return next();
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("MongoDB connected successfully!");
    next(); // Call next() to move to next middleware
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    // Pass error to Express error handler
    next(err);
  }
};

module.exports = connectDB;