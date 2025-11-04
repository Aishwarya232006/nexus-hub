const express = require("express");
const router = express.Router();
const UserService = require("./users-service");
const createUserRules = require("./middlewares/create-rules");
const updateUserRules = require("./middlewares/update-rules");

// Enhanced GET with search, sort, pagination
router.get("/", async (req, res) => {
  try {
    const result = await UserService.getAllUsers(req.query);
    
    res.status(200).json({
      success: true,
      count: result.users.length,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalUsers: result.total,
        hasNext: result.currentPage < result.totalPages,
        hasPrev: result.currentPage > 1
      },
      data: result.users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to retrieve users" 
    });
  }
});

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Error retrieving user" 
    });
  }
});

// CREATE user with validation - FIXED
router.post("/", createUserRules, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const newUser = await UserService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE user with validation - FIXED
router.put("/:id", updateUserRules, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await UserService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete user"
    });
  }
});

module.exports = router;