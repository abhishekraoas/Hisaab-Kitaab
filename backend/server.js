import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToMongoDB from "./config/dbConnection.js";
import { sessionConfig } from "./config/session.js";
import userRoutes from "./routes/user.route.js";
import tripRoutes from "./routes/trip.route.js";
import expenseRoutes from "./routes/expense.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/analytics", analyticsRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "🚀`Server running on port ${PORT}`" });
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

export default app;
