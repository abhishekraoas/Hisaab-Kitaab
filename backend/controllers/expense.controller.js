import expenseModel from "../models/expense.model.js";
import tripModel from "../models/trip.model.js";

// Create a new expense
const createExpense = async (req, res) => {
  const { tripId, paidBy, amount, description, splitAmount, date } = req.body;
  if (!tripId || !paidBy || !amount || !description || !splitAmount) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const newExpense = new expenseModel({
      tripId,
      paidBy,
      amount,
      description,
      splitAmount,
      date,
    });
    await newExpense.save();
    res
      .status(201)
      .json({ message: "Expense created successfully", expense: newExpense });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get expenses by ID
 const getExpenseById = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await expenseModel
      .findById(id)
      .populate("tripId", "tripName")
      .populate("paidBy", "name email")
      .populate("splitAmount", "name email");
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ expense });
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all expense by Trip ID
const getAllExpenseByTripId = async (req, res) => {
  const { tripId } = req.params;
  try {
    const expenses = await expenseModel
      .find({ tripId })
      .populate("tripId", "tripName")
      .populate("paidBy", "name email")
      .populate("splitAmount", "name email");
    res.status(200).json({ expenses });
  } catch (error) {
    console.error("Error fetching expenses for trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update an expense
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { tripId, paidBy, amount, description, splitAmount, date } = req.body;
  try {
    const updatedExpense = await expenseModel.findByIdAndUpdate(
      id,
      { tripId, paidBy, amount, description, splitAmount, date },
      { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedExpense = await expenseModel.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Split Trip Expense Logic
const splitTripExpense = async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!tripId) {
      return res.status(400).json({ message: "Trip ID is required." });
    }

    // Fetch trip details
    const trip = await tripModel.findById(tripId).populate("members", "name email");
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }

    // Fetch all expenses of this trip
    const expenses = await expenseModel.find({ tripId }).populate("paidBy", "_id name email");

    if (!expenses.length) {
      return res.status(400).json({ message: "No expenses found for this trip." });
    }

    // Calculate total paid by each user
    const balances = {};
    for (const member of trip.members) {
      balances[member._id] = { name: member.name, paid: 0, balance: 0 };
    }

    expenses.forEach((exp) => {
      if (exp.paidBy && balances[exp.paidBy._id]) {
        balances[exp.paidBy._id].paid += exp.amount;
      }
    });

    // Total trip cost and fair share
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const equalShare = totalExpense / trip.members.length;

    // Compute balance (positive = paid extra, negative = owes)
    for (const memberId in balances) {
      balances[memberId].balance = parseFloat((balances[memberId].paid - equalShare).toFixed(2));
    }

    res.status(200).json({
      message: "Trip split calculated successfully.",
      tripName: trip.tripName,
      totalExpense,
      equalShare: parseFloat(equalShare.toFixed(2)),
      balances,
    });
  } catch (error) {
    console.error("❌ Error calculating trip split:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { createExpense, getExpenseById, getAllExpenseByTripId, updateExpense, deleteExpense, splitTripExpense };