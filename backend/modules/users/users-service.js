const User = require("./users-model");
// ========== NEW IMPORTS FOR AUTHENTICATION ==========
const OTPModel = require("./otp-model");
const sendEmail = require("../../shared/middlewares/emails-utils");
const { encodeToken } = require("../../shared/middlewares/jwt-utils");
const { randomNumberOfNDigits } = require("../../shared/middlewares/compute-utils");

// PHASE 3: Mongoose CRUD Operations
class UserService {
  // CREATE (Original - Keep as is for admin/user creation)
  async createUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // ========== NEW AUTHENTICATION METHOD: REGISTER ==========
  // This is for user self-registration (includes password hashing)
  async register(userData) {
    try {
      const { email, freelancerId, password, ...rest } = userData;
      
      // Check if user exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { freelancerId }] 
      });
      
      if (existingUser) {
        throw new Error("User with this email or freelancer ID already exists");
      }
      
      // Create user (password will be hashed by pre-save middleware in user model)
      const user = new User({ email, freelancerId, password, ...rest });
      await user.save();
      
      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;
      
      return userResponse;
    } catch (error) {
      throw new Error(`Failed to register user: ${error.message}`);
    }
  }

  // ========== NEW AUTHENTICATION METHOD: LOGIN (STEP 1 - SEND OTP) ==========
  async login(email, password) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      // Verify password using the comparePassword method from user model
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }
      
      // Generate OTP
      const otp = randomNumberOfNDigits(6);
      
      // Save OTP to database (will auto-expire in 10 minutes)
      await OTPModel.findOneAndUpdate(
      { email: user.email },
      {
        email: user.email,
        otp: otp.toString(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      },
      { upsert: true, new: true } 
    );
      // Send OTP via email
      const emailSubject = "Your OTP for NexusHub Login";
      const emailMessage = `Hello ${user.name},\n\nYour OTP for login is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nNexusHub Team`;
      
      await sendEmail(user.email, emailSubject, emailMessage);
      
      return {
        email: user.email,
        name: user.name,
        requiresOTP: true
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // ========== NEW AUTHENTICATION METHOD: VERIFY OTP (STEP 2 - GET TOKEN) ==========
  async verifyOTP(email, otp) {
    try {
      // Find valid OTP (not expired)
      const otpRecord = await OTPModel.findOne({
        email: email.toLowerCase(),
        otp
      });
      
      if (!otpRecord) {
        throw new Error("Invalid or expired OTP");
      }
      
      // Get user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error("User not found");
      }
      
      // Delete used OTP
      await OTPModel.deleteOne({ _id: otpRecord._id });
      
      // Generate JWT token
      const token = encodeToken({
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        freelancerId: user.freelancerId
      });
      
      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;
      
      return {
        user: userResponse,
        token
      };
    } catch (error) {
      throw new Error(`OTP verification failed: ${error.message}`);
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