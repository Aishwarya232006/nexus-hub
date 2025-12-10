const express = require("express");
const { body, validationResult } = require("express-validator"); 
const router = express.Router();
const UserService = require("./users-service");
const authorize = require("../../shared/middlewares/authorize");

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

// ========== NEW AUTHENTICATION VALIDATION RULES ==========
const registerValidation = [
  body("freelancerId")
    .notEmpty()
    .withMessage("Freelancer ID is required")
    .isString()
    .withMessage("Freelancer ID must be a string"),
  
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

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

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

const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
    
  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

const otpValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
    
  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
];

// ===== PUBLIC ROUTES =====
// GET all users
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

// ========== NEW AUTHENTICATION ROUTES ==========
// REGISTER new user
router.post("/register", registerValidation, async (req, res) => {     
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const newUser = await UserService.register(req.body);      
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// LOGIN - Step 1: Send OTP
router.post("/login", loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const result = await UserService.login(email, password);
    
    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

// VERIFY OTP - Step 2: Get Token
router.post("/verify-otp", otpValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, otp } = req.body;
    const result = await UserService.verifyOTP(email, otp);
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

// ===== PROTECTED ROUTES =====
// UPDATE user (requires login)
router.put("/:id", authorize(["customer", "admin"]), updateUserValidation, async (req, res) => {   
  try {
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

// DELETE user (admin only)
router.delete("/:id", authorize(["admin"]), async (req, res) => {
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

// LOGOUT
router.post("/logout", authorize(["customer", "admin"]), async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful"
  });
});

module.exports = router;