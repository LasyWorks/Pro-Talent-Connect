const express = require("express");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getPublishedBlogs,
  togglePublish,
} = require("../services/blogController");
const { protect, authorize } = require("../Middleware/authMiddleware");

// Public routes - no authentication required
// Get all published blogs (public-facing)
router.get("/", getPublishedBlogs);

// Protected routes - require authentication
// Admin & Super Admin can view all blogs including drafts (must come before /:identifier)
router.get("/all", protect, authorize("Admin", "Super Admin"), getAllBlogs);

// Public route - Get single blog by ID or slug
router.get("/:identifier", getBlogById);

// Admin & Super Admin can create blogs
router.post("/", protect, authorize("Admin", "Super Admin"), createBlog);

// Admin & Super Admin can update blogs
router.put("/:id", protect, authorize("Admin", "Super Admin"), updateBlog);

// Admin & Super Admin can toggle publish status
router.patch("/:id/publish", protect, authorize("Admin", "Super Admin"), togglePublish);

// Only Super Admin can delete blogs
router.delete("/:id", protect, authorize("Super Admin"), deleteBlog);

module.exports = router;
