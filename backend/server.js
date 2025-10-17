require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");  // Your existing DB connection
const errorHandler = require("./shared/middlewares/error-handler");

// Import NEW modular routes
const { usersRoute } = require("./modules/users/users-routes");
const { listingsRoute } = require("./modules/listings/listings-routes");

// Import existing routes (keep for compatibility)
const userRoutes = require("./routes/users/usersRoutes");
const listingRoutes = require("./routes/listings/listingsRoutes");

const port = process.env.PORT || 5000;

const server = express();

// Application-level middlewares
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Connect to database (your existing)
connectDB();

// Mount NEW modular routes (Phase 2)
server.use("/api/v2", usersRoute);      // New version
server.use("/api/v2", listingsRoute);   // New version

// Mount existing routes (Phase 1 - keep working)
server.use("/api/v1/users", userRoutes);
server.use("/api/v1/listings", listingRoutes);

// 404 Not Found middleware
server.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    message: `${req.method} ${req.path} not found` 
  });
});

// Error handling middleware
server.use(errorHandler);

server.listen(port, (error) => {
  if (error) console.log(error.message);
  else console.log(`Nexus Hub server running on port ${port}`);
});