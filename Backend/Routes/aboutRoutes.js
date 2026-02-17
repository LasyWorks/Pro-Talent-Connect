const express = require("express");
const router = express.Router();
const {
  getAbout,
  updateAbout,
  uploadImages,
} = require("../services/aboutController");
const { protect, authorize } = require("../Middleware/authMiddleware");

// Public route - Get organisation profile
router.get("/", getAbout);

// Protected routes - Super Admin only
router.put("/", protect, authorize("Super Admin"), updateAbout);
router.post("/images", protect, authorize("Super Admin"), uploadImages);

module.exports = router;
