const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbURL = process.env.MONGO_URI;

    if (!dbURL) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(dbURL);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;