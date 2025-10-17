const { usersService } = require('../../services/csvDataService');

class UserModel {
  async getAllUsers() {
    try {
      const data = await usersService.getAll();
      return data.map(record => this.transformUser(record));
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      const record = await usersService.getById(id);
      if (!record) return null;
      return this.transformUser(record);
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      const newRecord = await usersService.add(userData);
      return this.transformUser(newRecord);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async updateUser(id, updates) {
    try {
      const updated = await usersService.update(id, updates);
      if (!updated) return null;
      return this.transformUser(updated);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      const deleted = await usersService.delete(id);
      if (!deleted) return null;
      return this.transformUser(deleted);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  transformUser(csvRecord) {
    return {
      id: csvRecord.Freelancer_ID,
      name: `Freelancer ${csvRecord.Freelancer_ID}`,
      email: `freelancer${csvRecord.Freelancer_ID}@nexushub.com`,
      experienceLevel: csvRecord.Experience_Level,
      hourlyRate: parseFloat(csvRecord.Hourly_Rate) || 0,
      jobSuccessRate: parseFloat(csvRecord.Job_Success_Rate) || 0,
      skills: [csvRecord.Job_Category],
      region: csvRecord.Client_Region,
      platform: csvRecord.Platform,
      earnings: parseFloat(csvRecord.Earnings_USD) || 0,
      clientRating: parseFloat(csvRecord.Client_Rating) || 0
    };
  }
}

module.exports = new UserModel();