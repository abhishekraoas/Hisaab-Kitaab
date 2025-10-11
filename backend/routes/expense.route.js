import { createExpense, getAllExpenseByTripId, updateExpense, deleteExpense, getExpenseById, splitTripExpense } from "../controllers/expense.controller.js";

import express from "express";
const router = express.Router();

// Create a new expense 
router.post("/create-expense", createExpense);

//Get Single expenses by ID route
router.get("/:id", getExpenseById);

// Get all expenses for a specific trip
router.get("/trip/:tripId", getAllExpenseByTripId);

// Update an expense 
router.put("/:id", updateExpense);

// Delete an expense
router.delete("/:id", deleteExpense);

// Split an expense
router.get("/split-trip-amount/:tripId", splitTripExpense);


export default router;