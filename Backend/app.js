const express = require("express");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const playerRoutes = require("./Routes/playerRoutes");
const dashboardRoutes = require("./Routes/dashboardRoutes");

const app = express();

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
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;
