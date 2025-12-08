require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./shared/middlewares/connect-db");
const errorHandler = require("./shared/middlewares/error-handler");

// Import routes
const usersRoutes = require("./modules/users/usersRoutes");
const listingsRoutes = require("./modules/listings/listingsRoutes");
const csvDataService = require("./services/csvDataService");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - allow frontend
app.use(cors({
  origin: "http://localhost:3000", // Your frontend URL
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
app.use(connectDB);

// Mount routes
app.use("/users", usersRoutes);
app.use("/listings", listingsRoutes);
app.use("/csv", csvDataService);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});