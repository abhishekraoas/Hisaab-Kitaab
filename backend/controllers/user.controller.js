const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Handle user sign-up
const handleUserSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Exclude password from response
    const { password: pwd, ...userData } = newUser.toObject();
    res
      .status(201)
      .json({ message: "User registered successfully", user: userData });
  } catch (error) {
    console.error("Error during user sign-up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Handle user login
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({
        message: "Login successful",
        user: { name: user.name, email: user.email },
        token,
      });
    } else {
      return res.status(400).json({ message: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleUserSignUp, handleUserLogin };
