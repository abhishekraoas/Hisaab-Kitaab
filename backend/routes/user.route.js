import {
  handleUserSignUp,
  verifyOTP,
  resendOTP,
  handleUserLogin,
  handleUserLogout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  searchUsers,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

import express from "express";
const router = express.Router();

// Authentication routes
router.post("/signup", handleUserSignUp);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/signin", handleUserLogin);
router.post("/logout", isAuthenticated, handleUserLogout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Profile routes (protected)
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateUserProfile);
router.delete("/profile", isAuthenticated, deleteUserAccount);

// User search route (protected)
router.get("/search", isAuthenticated, searchUsers);

// User search route (protected)
router.get("/search", isAuthenticated, searchUsers);

export default router;