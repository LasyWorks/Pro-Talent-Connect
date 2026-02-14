const express = require("express");
const router = express.Router();
const {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
} = require("../services/playerController");
const { protect, authorize } = require("../Middleware/authMiddleware");


router.use(protect);


router.post("/", authorize("Super Admin"), createPlayer);


router.get("/", authorize("Admin", "Super Admin"), getAllPlayers);
router.get("/:id", authorize("Admin", "Super Admin"), getPlayerById);


router.put("/:id", authorize("Admin", "Super Admin"), updatePlayer);


router.delete("/:id", authorize("Admin", "Super Admin"), deletePlayer);

module.exports = router;
