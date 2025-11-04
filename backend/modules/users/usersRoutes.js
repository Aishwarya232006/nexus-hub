const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const UserService = require("./users-service");

// Validation rules
const createUserValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),

  body("experienceLevel")
    .notEmpty()
    .withMessage("Experience level is required")
    .isIn(["Beginner", "Intermediate", "Expert", "Entry", "Mid", "Senior"])
    .withMessage("Experience level must be valid"),

  body("hourlyRate")
    .notEmpty()
    .withMessage("Hourly rate is required")
    .isFloat({ min: 0 })
    .withMessage("Hourly rate must be a positive number"),

  body("region")
    .notEmpty()
    .withMessage("Region is required")
    .isString()
    .withMessage("Region must be a string")
    .trim(),
];

const updateUserValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail(),

  body("experienceLevel")
    .optional()
    .isIn(["Beginner", "Intermediate", "Expert", "Entry", "Mid", "Senior"])
    .withMessage("Experience level must be valid"),

  body("hourlyRate")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Hourly rate must be a positive number"),

  body("region")
    .optional()
    .isString()
    .withMessage("Region must be a string")
    .trim(),
];

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

// CREATE user with PROPER validation
router.post("/", createUserValidation, async (req, res) => {
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

// UPDATE user with PROPER validation
router.put("/:id", updateUserValidation, async (req, res) => {
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