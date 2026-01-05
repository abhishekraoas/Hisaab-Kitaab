import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  getBudgetStatus,
  getMonthlySummary,
  getYearlySummary,
  exportData,
  exportPDF,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Get budget status and alerts
router.get("/budget-status", getBudgetStatus);

// Get monthly summary with category breakdown
router.get("/monthly-summary", getMonthlySummary);

// Get yearly summary with monthly trends
router.get("/yearly-summary", getYearlySummary);

// Export expense data as CSV
router.get("/export", exportData);

// Export expense data as PDF
router.get("/export-pdf", exportPDF);

export default router;
