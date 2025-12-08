const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  freelancerId: {
    type: String,
    required: [true, "Freelancer ID is required"],
    unique: true
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  // NEW: Authentication fields
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer"
  },
  experienceLevel: {
    type: String,
    required: [true, "Experience level is required"],
    enum: ["Beginner", "Intermediate", "Expert", "Entry", "Mid", "Senior"]
  },
  hourlyRate: {
    type: Number,
    required: [true, "Hourly rate is required"],
    min: 0
  },
  jobSuccessRate: {
    type: Number,
    min: 0,
    max: 100
  },
  skills: [String],
  region: {
    type: String,
    required: [true, "Region is required"]
  },
  platform: {
    type: String,
    required: [true, "Platform is required"]
  },
  earningsUSD: {
    type: Number,
    min: 0
  },
  clientRating: {
    type: Number,
    min: 0,
    max: 5
  },
  jobsCompleted: {
    type: Number,
    min: 0
  },
  jobDurationDays: {
    type: Number,
    min: 0
  },
  projectType: String,
  rehireRate: {
    type: Number,
    min: 0,
    max: 100
  },
  marketingSpend: {
    type: Number,
    min: 0
  },
  paymentMethod: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Password hashing middleware
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;