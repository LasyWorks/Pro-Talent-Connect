const express = require("express");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const playerRoutes = require("./Routes/playerRoutes");
const dashboardRoutes = require("./Routes/dashboardRoutes");
const blogRoutes = require("./Routes/blogRoutes");
const aboutRoutes = require("./Routes/aboutRoutes");
const auditLogRoutes = require("./Routes/auditLogRoutes");
const serviceRoutes = require("./Routes/serviceRoutes");
const contactRoutes = require("./Routes/contactRoutes");

const app = express();

// CORS Configuration - Restrict origins based on environment
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:3000", "http://localhost:5173"]; // Default for development

    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
  res.send("Pro-Talent-Connect API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api", serviceRoutes);
app.use("/api/contact", contactRoutes);

module.exports = app;
