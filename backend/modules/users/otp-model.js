const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    otp: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Create TTL index for automatic expiry cleanup
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTPModel = mongoose.model("OTP", otpSchema);
module.exports = OTPModel;