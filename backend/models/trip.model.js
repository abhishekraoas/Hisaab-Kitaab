import mongoose from "mongoose";
import crypto from "crypto";

const tripSchema = new mongoose.Schema({
  tripName: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ["Trip", "Flat", "Friends", "Office", "Other"],
    default: "Other"
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isActive: { type: Boolean, default: true },
  settledDate: { type: Date },
  inviteToken: { type: String, unique: true, sparse: true },
  inviteTokenExpiry: { type: Date }
}, { timestamps: true });

// Generate invite token
tripSchema.methods.generateInviteToken = function() {
  this.inviteToken = crypto.randomBytes(32).toString('hex');
  this.inviteTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return this.inviteToken;
};

// Check if invite token is valid
tripSchema.methods.isInviteTokenValid = function() {
  return this.inviteToken && this.inviteTokenExpiry && this.inviteTokenExpiry > new Date();
};

// Add index for faster queries
tripSchema.index({ createdBy: 1 });
tripSchema.index({ members: 1 });
tripSchema.index({ inviteToken: 1 });

export default mongoose.model("Trip", tripSchema);
