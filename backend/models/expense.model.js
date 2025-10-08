import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    description: String,
    splitAmong: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
