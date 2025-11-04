const express = require("express");
const listingsRoute = express.Router(); // Use express.Router() instead of Router()
const ListingService = require("./listings-service");
const createListingRules = require("./middlewares/create-rules");
const updateListingRules = require("./middlewares/update-rules");

// GET all listings with search, sort, pagination
listingsRoute.get("/listings", async (req, res) => {
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
listingsRoute.get("/listings/filters/options", async (req, res) => {
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
listingsRoute.get("/listings/:id", async (req, res) => {
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

// CREATE new listing with validation
listingsRoute.post("/listings", createListingRules, async (req, res) => {
  try {
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

// UPDATE listing with validation
listingsRoute.put("/listings/:id", updateListingRules, async (req, res) => {
  try {
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
listingsRoute.delete("/listings/:id", async (req, res) => {
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

module.exports = { listingsRoute };