const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const ListingService = require("./listings-service");

// Validation rules
const createListingValidation = [
  body("jobCategory")
    .notEmpty()
    .withMessage("Job category is required")
    .isString()
    .withMessage("Job category must be a string")
    .trim(),

  body("platform")
    .notEmpty()
    .withMessage("Platform is required")
    .isString()
    .withMessage("Platform must be a string")
    .trim(),

  body("experienceLevel")
    .notEmpty()
    .withMessage("Experience level is required")
    .isIn(["Beginner", "Intermediate", "Expert", "Entry", "Mid", "Senior"])
    .withMessage("Experience level must be valid"),

  body("clientRegion")
    .notEmpty()
    .withMessage("Client region is required")
    .isString()
    .withMessage("Client region must be a string")
    .trim(),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isString()
    .withMessage("Payment method must be a string")
    .trim(),

  body("earningsUSD")
    .notEmpty()
    .withMessage("Earnings USD is required")
    .isFloat({ min: 0 })
    .withMessage("Earnings must be a positive number"),

  body("hourlyRate")
    .notEmpty()
    .withMessage("Hourly rate is required")
    .isFloat({ min: 0 })
    .withMessage("Hourly rate must be a positive number"),
];

const updateListingValidation = [
  body("jobCategory")
    .optional()
    .isString()
    .withMessage("Job category must be a string")
    .trim(),

  body("platform")
    .optional()
    .isString()
    .withMessage("Platform must be a string")
    .trim(),

  body("experienceLevel")
    .optional()
    .isIn(["Beginner", "Intermediate", "Expert", "Entry", "Mid", "Senior"])
    .withMessage("Experience level must be valid"),

  body("clientRegion")
    .optional()
    .isString()
    .withMessage("Client region must be a string")
    .trim(),

  body("paymentMethod")
    .optional()
    .isString()
    .withMessage("Payment method must be a string")
    .trim(),

  body("earningsUSD")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Earnings must be a positive number"),

  body("hourlyRate")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Hourly rate must be a positive number"),
];

// GET all listings with search, sort, pagination
router.get("/", async (req, res) => {
  try {
    const result = await ListingService.getAllListings(req.query);
    
    res.status(200).json({
      success: true,
      count: result.listings.length,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalListings: result.total,
        hasNext: result.currentPage < result.totalPages,
        hasPrev: result.currentPage > 1
      },
      data: result.listings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to retrieve listings" 
    });
  }
});

// GET filter options
router.get("/filters/options", async (req, res) => {
  try {
    const filters = await ListingService.getFilterOptions();
    res.status(200).json({
      success: true,
      data: filters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get filter options"
    });
  }
});

// GET listing by ID
router.get("/:id", async (req, res) => {
  try {
    const listing = await ListingService.getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ 
        success: false,
        message: "Listing not found" 
      });
    }
    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Error retrieving listing" 
    });
  }
});

// CREATE new listing with PROPER validation
router.post("/", createListingValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const newListing = await ListingService.createListing(req.body);
    res.status(201).json({
      success: true,
      data: newListing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE listing with PROPER validation
router.put("/:id", updateListingValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const updatedListing = await ListingService.updateListing(req.params.id, req.body);
    if (!updatedListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }
    res.status(200).json({
      success: true,
      data: updatedListing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE listing
router.delete("/:id", async (req, res) => {
  try {
    const deletedListing = await ListingService.deleteListing(req.params.id);
    if (!deletedListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
      data: deletedListing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete listing"
    });
  }
});

module.exports = router;