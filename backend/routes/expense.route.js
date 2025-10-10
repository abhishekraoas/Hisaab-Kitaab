import { createExpense, getExpenseById, updateExpense, deleteExpense } from "../controllers/expense.controller.js";

import express from "express";
const router = express.Router();

// Create a new expense route
router.post("/create-expense", createExpense);

// Get all expenses for a specific trip route
router.get("/:id", getExpenseById);

// Update an expense route
router.put("/:id", updateExpense);

// Delete an expense route
router.delete("/:id", deleteExpense);

export default router;