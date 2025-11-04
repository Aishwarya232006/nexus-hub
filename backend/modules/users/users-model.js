const mongoose = require("mongoose");

// PHASE 3: Mongoose Schema matching Phase 2 structure
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
  timestamps: true // Adds createdAt and updatedAt automatically
});

const User = mongoose.model("User", userSchema);

module.exports = User;