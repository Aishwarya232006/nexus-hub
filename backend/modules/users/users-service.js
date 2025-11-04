const User = require("./users-model");

// ✅ PHASE 3: Mongoose CRUD Operations
class UserService {
  // CREATE
  async createUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // READ - Get all users with search, sort, pagination
  async getAllUsers(filters = {}) {
    try {
      const { 
        search, 
        sortBy = "name", 
        page = 1, 
        limit = 10,
        experienceLevel,
        minRate,
        maxRate,
        region 
      } = filters;

      // Build search filter
      let searchFilter = {};
      
      if (search) {
        searchFilter = {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { skills: { $regex: search, $options: "i" } },
            { region: { $regex: search, $options: "i" } },
            { platform: { $regex: search, $options: "i" } }
          ]
        };
      }

      // Add additional filters
      if (experienceLevel) {
        searchFilter.experienceLevel = experienceLevel;
      }
      if (region) {
        searchFilter.region = region;
      }
      if (minRate || maxRate) {
        searchFilter.hourlyRate = {};
        if (minRate) searchFilter.hourlyRate.$gte = parseFloat(minRate);
        if (maxRate) searchFilter.hourlyRate.$lte = parseFloat(maxRate);
      }

      const users = await User.find(searchFilter)
        .sort({ [sortBy]: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(searchFilter);

      return {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      };
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  // READ - Get user by ID
  async getUserById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // READ - Get user by freelancer ID
  async getUserByFreelancerId(freelancerId) {
    try {
      return await User.findOne({ freelancerId });
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // UPDATE
  async updateUser(id, updates) {
    try {
      return await User.findByIdAndUpdate(
        id, 
        updates, 
        { 
          new: true, // Return updated document
          runValidators: true // Run schema validations
        }
      );
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // DELETE
  async deleteUser(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}

module.exports = new UserService();