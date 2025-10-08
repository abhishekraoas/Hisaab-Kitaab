import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  tripName: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
