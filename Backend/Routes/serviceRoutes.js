const express = require("express");
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAllHowItWorks,
  getHowItWorkById,
  createHowItWork,
  updateHowItWork,
  deleteHowItWork,
} = require("../services/serviceController");
const { protect } = require("../Middleware/authMiddleware");

// Public routes
router.get("/services", getAllServices);
router.get("/services/:id", getServiceById);
router.get("/how-it-works", getAllHowItWorks);
router.get("/how-it-works/:id", getHowItWorkById);

// Protected routes (Admin only)
router.post("/services", protect, createService);
router.put("/services/:id", protect, updateService);
router.delete("/services/:id", protect, deleteService);

router.post("/how-it-works", protect, createHowItWork);
router.put("/how-it-works/:id", protect, updateHowItWork);
router.delete("/how-it-works/:id", protect, deleteHowItWork);

module.exports = router;
