const express = require("express");
const router = express.Router();
const { usersService, listingsService } = require("./csvDataService");

// GET all users from CSV
router.get("/users", async (req, res) => {
  try {
    const data = await usersService.getAll();
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET all listings from CSV
router.get("/listings", async (req, res) => {
  try {
    const data = await listingsService.getAll();
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;