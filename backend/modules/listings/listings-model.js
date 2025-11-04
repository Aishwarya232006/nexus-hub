const mongoose = require("mongoose");

// Phase 3: Mongoose Schema matching CSV structure
const listingSchema = new mongoose.Schema({
  freelancerId: {
    type: String,
    required: [true, "Freelancer ID is required"],
    unique: true
  },
  jobCategory: {
    type: String,
    required: [true, "Job category is required"],
    trim: true
  },
  platform: {
    type: String,
    required: [true, "Platform is required"],
    trim: true
  },
  experienceLevel: {
    type: String,
    required: [true, "Experience level is required"],
    enum: ["Beginner", "Intermediate", "Expert", "Entry", "Mid", "Senior"]
  },
  clientRegion: {
    type: String,
    required: [true, "Client region is required"],
    trim: true
  },
  paymentMethod: {
    type: String,
    required: [true, "Payment method is required"],
    trim: true
  },
  jobsCompleted: {
    type: Number,
    min: 0,
    default: 0
  },
  earningsUSD: {
    type: Number,
    required: [true, "Earnings USD is required"],
    min: 0
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
  clientRating: {
    type: Number,
    min: 0,
    max: 5
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
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;