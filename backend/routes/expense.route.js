import { 
  createExpense, 
  getExpenseById,
  getAllExpenseByTripId, 
  updateExpense, 
  deleteExpense, 
  calculateSettlements 
} from "../controllers/expense.controller.js";
import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Create a new expense with split calculation
router.post("/create-expense", createExpense);

// Get single expense by ID
router.get("/:id", getExpenseById);

// Get all expenses for a specific trip
router.get("/trip/:tripId", getAllExpenseByTripId);

// Calculate settlements for a trip (who owes whom)
router.get("/settlements/:tripId", calculateSettlements);

// Update an expense
router.put("/:id", updateExpense);

// Delete an expense
router.delete("/:id", deleteExpense);

export default router;