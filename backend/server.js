const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongoDB = require("./config/dbConnection");
const userRoutes = require("./routes/user.route.js");
const tripRoutes = require("./routes/trip.route.js");
const expenseRoutes = require("./routes/expense.route.js");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/expenses", expenseRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Server is Running Successfully!" });
});

// Start server with DB connection
const startServer = async () => {
  try {
    await connectToMongoDB(process.env.URL_DB);

    app.listen(PORT, () => {
      console.log(`✅ Server is running on Port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
