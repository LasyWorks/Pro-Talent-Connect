const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  registerAdmin,
  getProfile,
  changePassword,
} = require("../services/authController");
const { protect, authorize } = require("../Middleware/authMiddleware");

// Public
router.post("/login", loginAdmin);

// Super Admin only — register new admins
router.post("/register", protect, authorize("Super Admin"), registerAdmin);

// Any authenticated admin
router.get("/profile", protect, getProfile);

// Change password — any authenticated admin
router.put("/change-password", protect, changePassword);

module.exports = router;
