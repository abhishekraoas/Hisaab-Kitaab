import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import crypto from "crypto";
import {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetEmail,
} from "../utils/emailService.js";
dotenv.config();

// Handle user sign-up (Step 1: Create account, send OTP)
const handleUserSignUp = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  
  // Validation
  if (!name || !email || !password || !mobile) {
    return res
      .status(400)
      .json({ message: "Name, email, mobile, and password are required." });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  // Mobile validation
  if (mobile.length < 10) {
    return res.status(400).json({ message: "Mobile number must be at least 10 digits." });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          message: "Email already registered. Please login or use a different email.",
        });
      }
      if (existingUser.mobile === mobile) {
        return res.status(400).json({
          message: "Mobile number already registered. Please use a different number.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = new userModel({
      name,
      email,
      mobile,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    await newUser.save();
    console.log("✅ User created successfully:", email);

    // Send OTP email
    try {
      const emailResult = await sendOTPEmail(email, otp, name);
      if (!emailResult.success) {
        console.error("❌ Failed to send OTP email:", emailResult.error);
        // Delete user if email failed
        await userModel.findByIdAndDelete(newUser._id);
        return res.status(500).json({ 
          message: "Failed to send OTP email. Please check your email address or try again later." 
        });
      }
      console.log("✅ OTP email sent to:", email);
    } catch (emailError) {
      console.error("❌ Email service error:", emailError);
      // Delete user if email failed
      await userModel.findByIdAndDelete(newUser._id);
      return res.status(500).json({ 
        message: "Email service error. Please try again later." 
      });
    }

    res.status(201).json({
      message: "Registration successful. Please verify your email with the OTP sent.",
      email: email,
    });
  } catch (error) {
    console.error("❌ Error during user sign-up:", error);
    
    // MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different ${field}.` 
      });
    }
    
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ 
      message: "Server error. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPEmail(email, otp, user.name);

    res.status(200).json({ message: "OTP has been resent to your email." });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Handle user login (Session-based)
const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in.",
        requiresVerification: true,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create session
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.name = user.name;

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        income: user.income,
        monthlyBudget: user.monthlyBudget,
      },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Handle user logout
const handleUserLogout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot password - Send reset link
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User with this email does not exist." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiry = resetPasswordExpiry;
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(email, resetToken, user.name);

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required." });
  }

  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now login." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.session.userId).select("-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { name, mobile, income, monthlyBudget } = req.body;

  try {
    const user = await userModel.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if mobile is being changed and if it's already taken
    if (mobile && mobile !== user.mobile) {
      const existingUser = await userModel.findOne({ mobile });
      if (existingUser) {
        return res.status(400).json({ message: "Mobile number already in use." });
      }
      user.mobile = mobile;
    }

    if (name) user.name = name;
    if (income !== undefined) user.income = income;
    if (monthlyBudget !== undefined) user.monthlyBudget = monthlyBudget;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.otp;
    delete updatedUser.otpExpiry;
    delete updatedUser.resetPasswordToken;
    delete updatedUser.resetPasswordExpiry;

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete user account
const deleteUserAccount = async (req, res) => {
  try {
    const user = await userModel.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // TODO: Delete user's expenses and group associations
    await userModel.findByIdAndDelete(req.session.userId);

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to delete account" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Account deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Search users by name or email
const searchUsers = async (req, res) => {
  const { query } = req.query;
  const currentUserId = req.session.userId;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ message: "Search query must be at least 2 characters" });
  }

  try {
    const users = await userModel
      .find({
        _id: { $ne: currentUserId }, // Exclude current user
        isVerified: true, // Only verified users
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      })
      .select("name email")
      .limit(10);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
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
};
