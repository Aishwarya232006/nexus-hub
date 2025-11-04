require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./shared/middlewares/connect-db");
const errorHandler = require("./shared/middlewares/error-handler");

// Import modular routes
const usersRouter = require("./modules/users/usersRoutes");
const listingsRouter = require("./modules/listings/listingsRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB first
connectDB();

// Application-level middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", usersRouter);
app.use("/api/listings", listingsRouter);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Nexus Hub API is running",
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Nexus Hub Backend API",
    version: "1.0.0"
  });
});

// Error handler middleware
app.use(errorHandler);

app.listen(port, (error) => {
  if (error) {
    console.log("Server error:", error.message);
  } else {
    console.log(` Nexus Hub server running on port ${port}`);
    console.log(` Environment: ${process.env.NODE_ENV}`);
    console.log(`  MongoDB: Connected`);
    console.log(` API Base URL: http://localhost:${port}/api`);
  }
});