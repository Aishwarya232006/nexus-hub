const Listing = require("./listings-model");

class ListingService {
  // CREATE
  async createListing(listingData) {
    try {
      const listing = new Listing(listingData);
      return await listing.save();
    } catch (error) {
      throw new Error(`Failed to create listing: ${error.message}`);
    }
  }

  // READ - Get all listings with search, sort, pagination
  async getAllListings(filters = {}) {
    try {
      const { 
        search, 
        sortBy = "jobCategory", 
        page = 1, 
        limit = 10,
        experienceLevel,
        jobCategory,
        platform,
        minEarnings,
        maxEarnings,
        minRate,
        maxRate
      } = filters;

      // Build search filter
      let searchFilter = {};
      
      if (search) {
        searchFilter = {
          $or: [
            { jobCategory: { $regex: search, $options: "i" } },
            { platform: { $regex: search, $options: "i" } },
            { clientRegion: { $regex: search, $options: "i" } },
            { paymentMethod: { $regex: search, $options: "i" } }
          ]
        };
      }

      // Add additional filters
      if (experienceLevel) {
        searchFilter.experienceLevel = experienceLevel;
      }
      if (jobCategory) {
        searchFilter.jobCategory = jobCategory;
      }
      if (platform) {
        searchFilter.platform = platform;
      }
      if (minEarnings || maxEarnings) {
        searchFilter.earningsUSD = {};
        if (minEarnings) searchFilter.earningsUSD.$gte = parseFloat(minEarnings);
        if (maxEarnings) searchFilter.earningsUSD.$lte = parseFloat(maxEarnings);
      }
      if (minRate || maxRate) {
        searchFilter.hourlyRate = {};
        if (minRate) searchFilter.hourlyRate.$gte = parseFloat(minRate);
        if (maxRate) searchFilter.hourlyRate.$lte = parseFloat(maxRate);
      }

      const listings = await Listing.find(searchFilter)
        .sort({ [sortBy]: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Listing.countDocuments(searchFilter);

      return {
        listings,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      };
    } catch (error) {
      throw new Error(`Failed to get listings: ${error.message}`);
    }
  }

  // READ - Get listing by ID
  async getListingById(id) {
    try {
      return await Listing.findById(id);
    } catch (error) {
      throw new Error(`Failed to get listing: ${error.message}`);
    }
  }

  // READ - Get listing by freelancer ID
  async getListingByFreelancerId(freelancerId) {
    try {
      return await Listing.findOne({ freelancerId });
    } catch (error) {
      throw new Error(`Failed to get listing: ${error.message}`);
    }
  }

  // UPDATE
  async updateListing(id, updates) {
    try {
      return await Listing.findByIdAndUpdate(
        id, 
        updates, 
        { 
          new: true,
          runValidators: true
        }
      );
    } catch (error) {
      throw new Error(`Failed to update listing: ${error.message}`);
    }
  }

  // DELETE
  async deleteListing(id) {
    try {
      return await Listing.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Failed to delete listing: ${error.message}`);
    }
  }

  // Get unique values for filters
  async getFilterOptions() {
    try {
      const categories = await Listing.distinct('jobCategory');
      const platforms = await Listing.distinct('platform');
      const experienceLevels = await Listing.distinct('experienceLevel');
      const regions = await Listing.distinct('clientRegion');
      
      return {
        categories,
        platforms,
        experienceLevels,
        regions
      };
    } catch (error) {
      throw new Error(`Failed to get filter options: ${error.message}`);
    }
  }
}

module.exports = new ListingService();