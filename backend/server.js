require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./shared/middlewares/error-handler");

// Import Phase 2 modular routes
const { usersRoute } = require("./modules/users/usersRoutes");
const { listingsRoute } = require("./modules/listings/listingsRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Application-level middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
app.use(connectDB);
// Application-level middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test route to verify server is working
app.get("/", (req, res) => {
  res.json({ 
    message: "Nexus Hub API Server is running",
    version: "Phase 2",
    status: "Operational"
  });
});
// Simple test route to verify server is working
app.get("/", (req, res) => {
  res.json({ 
    message: "Nexus Hub API Server is running",
    version: "Phase 2 - Modular Architecture",
    status: "Operational"
  });
});

// Database status check
app.get("/api/status", (req, res) => {
  const mongoose = require("mongoose");
  const dbStatus = mongoose.connection.readyState;
  
  const statusMessages = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting", 
    3: "Disconnecting"
  };
  
  res.status(200).json({
    server: "Running",
    database: statusMessages[dbStatus] || "Unknown",
    databaseState: dbStatus
  });
});

// Mount Phase 2 modular routes
app.use("/api/v2", usersRoute);
app.use("/api/v2", listingsRoute);

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    message: `${req.method} ${req.path} not found` 
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, (error) => {
  if (error) {
    console.log("Server error:", error.message);
  } else {
    console.log(`Nexus Hub server running on port ${port}`);
  }
});