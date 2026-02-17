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


router.use(protect);

// Admin & Super Admin can create players
router.post("/", authorize("Admin", "Super Admin"), createPlayer);

// Admin & Super Admin can view players
router.get("/", authorize("Admin", "Super Admin"), getAllPlayers);

// Search players - must be before /:id route
router.get("/search", authorize("Admin", "Super Admin"), searchPlayers);

router.get("/:id", authorize("Admin", "Super Admin"), getPlayerById);

// Admin & Super Admin can update players
router.put("/:id", authorize("Admin", "Super Admin"), updatePlayer);

// Only Super Admin can delete players
router.delete("/:id", authorize("Super Admin"), deletePlayer);

module.exports = router;
