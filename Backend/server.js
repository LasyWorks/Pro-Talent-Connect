require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/DB");

// Route imports
const authRoutes = require("./Routes/authRoutes");
const playerRoutes = require("./Routes/playerRoutes");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
  res.send("Pro-Talent-Connect API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
