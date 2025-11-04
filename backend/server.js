require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // This is now middleware
const errorHandler = require("./shared/middlewares/error-handler");

// Import modular routes
const { usersRoute } = require("./modules/users/usersRoutes");
const { listingsRoute } = require("./modules/listings/listingsRoutes");

const app = express();
const port = process.env.PORT || 5000;

// FIX: Use connectDB as Express middleware
app.use(connectDB);

// Application-level middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ... rest of your routes

app.listen(port, (error) => {
  if (error) {
    console.log("Server error:", error.message);
  } else {
    console.log(`Nexus Hub server running on port ${port}`);
  }
});