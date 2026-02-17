const express = require("express");
const router = express.Router();
const {
  createPlayer,
  getAllPlayers,
  searchPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
} = require("../services/playerController");
const { protect, authorize } = require("../Middleware/authMiddleware");

// Public routes - no authentication required
router.get("/", getAllPlayers);
router.get("/search", searchPlayers);
router.get("/:id", getPlayerById);

// Protected routes - require authentication
router.use(protect);

// Admin & Super Admin can create players
router.post("/", authorize("Admin", "Super Admin"), createPlayer);

// Admin & Super Admin can update players
router.put("/:id", authorize("Admin", "Super Admin"), updatePlayer);

// Only Super Admin can delete players
router.delete("/:id", authorize("Super Admin"), deletePlayer);

module.exports = router;
