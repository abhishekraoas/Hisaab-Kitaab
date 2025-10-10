import expenseModel from "../models/expense.model.js";

// Create a new expense
const createExpense = async (req, res) => {
  const { tripId, paidBy, amount, description, splitAmong, date } = req.body;
  if (!tripId || !paidBy || !amount || !description || !splitAmong) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const newExpense = new expenseModel({
      tripId,
      paidBy,
      amount,
      description,
      splitAmong,
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

// Get all expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await expenseModel
      .find()
      .populate("tripId", "tripName")
      .populate("paidBy", "name email")
      .populate("splitAmong", "name email");
    res.status(200).json({ expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get expense by ID
const getExpenseById = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await expenseModel
      .findById(id)
      .populate("tripId", "tripName")
      .populate("paidBy", "name email")
      .populate("splitAmong", "name email");
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ expense });
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update an expense
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { tripId, paidBy, amount, description, splitAmong, date } = req.body;
  try {
    const updatedExpense = await expenseModel.findByIdAndUpdate(
      id,
      { tripId, paidBy, amount, description, splitAmong, date },
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

export { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense };