const Player = require("../Models/Players");

// @desc    Create a new player
// @route   POST /api/players
// @access  Private / Super Admin only
const createPlayer = async (req, res) => {
  try {
    const {
      name,
      playingPosition,
      alternativePosition,
      preferredFoot,
      transferMarketLink,
      playerId,
      dateOfBirth,
      weight,
      height,
      gender,
      mobileNumber,
      email,
      clubsPlayed,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !playingPosition ||
      !playerId ||
      !dateOfBirth ||
      !gender ||
      !mobileNumber ||
      !email
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check for duplicate playerId or email
    const existingPlayer = await Player.findOne({
      $or: [{ playerId }, { email }],
    });

    if (existingPlayer) {
      return res
        .status(400)
        .json({ message: "Player with this playerId or email already exists" });
    }

    const player = await Player.create({
      name,
      playingPosition,
      alternativePosition,
      preferredFoot,
      transferMarketLink,
      playerId,
      dateOfBirth,
      weight,
      height,
      gender,
      mobileNumber,
      email,
      clubsPlayed,
    });

    res.status(201).json(player);
  } catch (error) {
    console.error("Create player error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all players (with optional search & pagination)
// @route   GET /api/players
// @access  Private / Admin & Super Admin
const getAllPlayers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter from query params
    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.playingPosition) {
      filter.playingPosition = {
        $regex: req.query.playingPosition,
        $options: "i",
      };
    }
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }
    if (req.query.preferredFoot) {
      filter.preferredFoot = req.query.preferredFoot;
    }

    const total = await Player.countDocuments(filter);
    const players = await Player.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      players,
      page,
      totalPages: Math.ceil(total / limit),
      totalPlayers: total,
    });
  } catch (error) {
    console.error("Get players error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single player by ID
// @route   GET /api/players/:id
// @access  Private / Admin & Super Admin
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(player);
  } catch (error) {
    console.error("Get player error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Player not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a player
// @route   PUT /api/players/:id
// @access  Private / Admin & Super Admin
const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Update only provided fields
    const updatableFields = [
      "name",
      "playingPosition",
      "alternativePosition",
      "preferredFoot",
      "transferMarketLink",
      "playerId",
      "dateOfBirth",
      "weight",
      "height",
      "gender",
      "mobileNumber",
      "email",
      "clubsPlayed",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        player[field] = req.body[field];
      }
    });

    const updatedPlayer = await player.save();
    res.status(200).json(updatedPlayer);
  } catch (error) {
    console.error("Update player error:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate playerId or email" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a player
// @route   DELETE /api/players/:id
// @access  Private / Admin & Super Admin
const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    await player.deleteOne();
    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Delete player error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
};
