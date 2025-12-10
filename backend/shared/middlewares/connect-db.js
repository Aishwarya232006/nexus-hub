const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async (req, res, next) => {
  // FIX: Always ensure we have a next function
  const nextFunc = typeof next === 'function' ? next : () => {};
  
  try {
    if (!isConnected) {
      const dbURL = process.env.MONGO_URI;

      if (!dbURL) {
        console.error("ERROR: MONGO_URI is not defined in .env file");
        process.exit(1); // Exit immediately
      }

      await mongoose.connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("✓ MongoDB connected successfully!");
      isConnected = true;
    }
    
    // Only call next if it's a function
    if (typeof nextFunc === 'function') {
      nextFunc();
    }
  } catch (error) {
    console.error("✗ Database connection failed:", error.message);
    
    // Fatal error - exit process
    console.error("Fatal: Could not connect to database on startup");
    process.exit(1);
  }
};

module.exports = connectDB;