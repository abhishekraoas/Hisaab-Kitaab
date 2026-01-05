import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Food", "Travel", "Accommodation", "Entertainment", "Shopping", "Other"],
      default: "Other"
    },
    splitType: {
      type: String,
      enum: ["equal", "custom", "percentage"],
      default: "equal"
    },
    splitDetails: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      amount: { type: Number },
      percentage: { type: Number }
    }],
    date: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
