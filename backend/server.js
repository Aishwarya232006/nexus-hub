require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./shared/middlewares/connect-db");
const errorHandler = require("./shared/middlewares/error-handler");

// Import routes
const { usersRoute } = require("./modules/users/users-routes");
const { listingsRoute } = require("./modules/listings/listings-routes");

const port = process.env.PORT || 5000;
const hostname = "localhost";

const server = express();

// Application-level middlewares
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Mount routes
server.use("/api", usersRoute);
server.use("/api", listingsRoute);

// 404 Not Found middleware
server.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    message: `${req.method} ${req.path} not found` 
  });
});

// Error handling middleware
server.use(errorHandler);

server.listen(port, hostname, (error) => {
  if (error) console.log(error.message);
  else console.log(`Nexus Hub server running on http://${hostname}:${port}`);
});