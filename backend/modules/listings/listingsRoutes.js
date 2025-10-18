const { Router } = require("express");
// Comment out middleware imports temporarily
// const createListingRules = require("./middlewares/create-rules");
// const updateListingRules = require("./middlewares/update-rules");
const ListingModel = require("./listings-model");

const listingsRoute = Router();

// GET all listings
listingsRoute.get("/listings", async (req, res) => {
  try {
    const listings = await ListingModel.getAllListings();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve listings" });
  }
});

// GET listing by ID
listingsRoute.get("/listings/:id", async (req, res) => {
  try {
    const listing = await ListingModel.getListingById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving listing" });
  }
});

// CREATE new listing - TEMPORARILY WITHOUT VALIDATION
listingsRoute.post("/listings", async (req, res) => {
  try {
    const { jobCategory, platform, experienceLevel } = req.body;
    if (!jobCategory || !platform || !experienceLevel) {
      return res.status(400).json({ 
        error: "Validation failed",
        message: "Job category, platform, and experience level are required" 
      });
    }
    
    const newListing = await ListingModel.createListing(req.body);
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: "Failed to create listing" });
  }
});

module.exports = { listingsRoute };