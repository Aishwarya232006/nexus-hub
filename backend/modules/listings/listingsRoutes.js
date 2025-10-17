const { Router } = require("express");
const createListingRules = require("./middlewares/create-rules");
const updateListingRules = require("./middlewares/update-rules");
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

// GET listings by category
listingsRoute.get("/listings/category/:category", async (req, res) => {
  try {
    const listings = await ListingModel.getListingsByCategory(req.params.category);
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving listings by category" });
  }
});

// CREATE new listing
listingsRoute.post("/listings", createListingRules, async (req, res) => {
  try {
    const newListing = await ListingModel.createListing(req.body);
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: "Failed to create listing" });
  }
});

// UPDATE listing
listingsRoute.put("/listings/:id", updateListingRules, async (req, res) => {
  try {
    const updatedListing = await ListingModel.updateListing(req.params.id, req.body);
    if (!updatedListing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({ error: "Failed to update listing" });
  }
});

// DELETE listing
listingsRoute.delete("/listings/:id", async (req, res) => {
  try {
    const deletedListing = await ListingModel.deleteListing(req.params.id);
    if (!deletedListing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(deletedListing);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

module.exports = { listingsRoute };