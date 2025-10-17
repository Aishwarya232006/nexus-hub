const { listingsService } = require('../../services/csvDataService');

class ListingModel {
  async getAllListings() {
    try {
      const data = await listingsService.getAll();
      return data.map(record => this.transformListing(record));
    } catch (error) {
      throw new Error(`Failed to get listings: ${error.message}`);
    }
  }

  async getListingById(id) {
    try {
      const record = await listingsService.getById(id);
      if (!record) return null;
      return this.transformListing(record);
    } catch (error) {
      throw new Error(`Failed to get listing: ${error.message}`);
    }
  }

  async getListingsByCategory(category) {
    try {
      const records = await listingsService.getByField('Job_Category', category);
      return records.map(record => this.transformListing(record));
    } catch (error) {
      throw new Error(`Failed to get listings by category: ${error.message}`);
    }
  }

  async createListing(listingData) {
    try {
      const newRecord = await listingsService.add(listingData);
      return this.transformListing(newRecord);
    } catch (error) {
      throw new Error(`Failed to create listing: ${error.message}`);
    }
  }

  async updateListing(id, updates) {
    try {
      const updated = await listingsService.update(id, updates);
      if (!updated) return null;
      return this.transformListing(updated);
    } catch (error) {
      throw new Error(`Failed to update listing: ${error.message}`);
    }
  }

  async deleteListing(id) {
    try {
      const deleted = await listingsService.delete(id);
      if (!deleted) return null;
      return this.transformListing(deleted);
    } catch (error) {
      throw new Error(`Failed to delete listing: ${error.message}`);
    }
  }

  transformListing(csvRecord) {
    return {
      id: csvRecord.Freelancer_ID,
      freelancerId: csvRecord.Freelancer_ID,
      jobCategory: csvRecord.Job_Category,
      platform: csvRecord.Platform,
      experienceLevel: csvRecord.Experience_Level,
      clientRegion: csvRecord.Client_Region,
      paymentMethod: csvRecord.Payment_Method,
      jobsCompleted: parseInt(csvRecord.Job_Completed) || 0,
      earningsUSD: parseFloat(csvRecord.Earnings_USD) || 0,
      hourlyRate: parseFloat(csvRecord.Hourly_Rate) || 0,
      jobSuccessRate: parseFloat(csvRecord.Job_Success_Rate) || 0,
      clientRating: parseFloat(csvRecord.Client_Rating) || 0,
      jobDurationDays: parseInt(csvRecord.Job_Duration_Days) || 0,
      projectType: csvRecord.Project_Type,
      rehireRate: parseFloat(csvRecord.Rehire_Rate) || 0,
      marketingSpend: parseFloat(csvRecord.Marketing_Spend) || 0
    };
  }
}

module.exports = new ListingModel();