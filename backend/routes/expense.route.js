import { createExpense, getAllExpenseByTripId, updateExpense, deleteExpense, getExpenseById } from "../controllers/expense.controller.js";

import express from "express";
const router = express.Router();

// Create a new expense route
router.post("/create-expense", createExpense);

//Get Single expenses by ID route
router.get("/:id", getExpenseById);

// Get all expenses for a specific trip route
router.get("/trip/:tripId", getAllExpenseByTripId);

// Update an expense route
router.put("/:id", updateExpense);

// Delete an expense route
router.delete("/:id", deleteExpense);

//Split Expense Route
router.post("/split-expense", (req, res) => {
  // Logic for splitting expense goes here
  res.status(200).json({ message: "Expense split successfully" });
});

export default router;