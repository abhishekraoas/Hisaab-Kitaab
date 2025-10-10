const {createExpense, getExpensesByTripId, updateExpense, deleteExpense} = require("../controllers/expense.controller.js");

const express = require("express");
const router = express.Router();

// Create a new expense route
router.post("/create-expense", createExpense);

// Get all expenses for a specific trip route
router.get("/trip/:tripId", getExpensesByTripId);

// Update an expense route
router.put("/:id", updateExpense);

// Delete an expense route
router.delete("/:id", deleteExpense);

module.exports = router;