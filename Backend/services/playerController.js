const Player = require("../Models/Players");
const { logAction } = require("../Middleware/auditLogger");

// @desc    Create a new player
// @route   POST /api/players
// @access  Private / Super Admin Only
const createPlayer = async (req, res) => {
  try {
    // Only Super Admin can create players
    if (req.user.role !== "Super Admin") {
      return res.status(403).json({ message: "Access denied. Only Super Admin can create players." });
    }

    const {
      name,
      age,
      age_group,
      playingPosition,
      alternativePosition,
      preferredFoot,
      transferMarketLink,
      playerId,
      dateOfBirth,
      nationality,
      weight,
      height,
      gender,
      jersey_no,
      size,
      city,
      address,
      mobileNumber,
      email,
      profileImage,
      scouting_notes,
      career_history,
      media_links,
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

    // Check for duplicate playerId or email (only among non-deleted players)
    const existingPlayer = await Player.findOne({
      $or: [{ playerId }, { email }],
      isDeleted: false,
    });

    if (existingPlayer) {
      return res
        .status(400)
        .json({ message: "Duplicate playerId or email" });
    }

    const player = await Player.create({
      name,
      age,
      age_group,
      playingPosition,
      alternativePosition,
      preferredFoot,
      transferMarketLink,
      playerId,
      dateOfBirth,
      nationality,
      weight,
      height,
      gender,
      jersey_no,
      size,
      city,
      address,
      mobileNumber,
      email,
      profileImage,
      scouting_notes,
      career_history,
      media_links,
      clubsPlayed,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    // Populate admin details before returning
    await player.populate("createdBy", "name email role");
    await player.populate("updatedBy", "name email role");

    // Log player creation
    await logAction({
      user: req.user,
      action: "CREATE",
      resourceType: "Player",
      resourceId: player._id.toString(),
      description: `Player created: ${player.name} (ID: ${player.playerId})`,
      req,
      changes: { name, playerId, playingPosition, email },
      status: "SUCCESS"
    });

    res.status(201).json(player);
  } catch (error) {
    console.error("Create player error:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate playerId or email" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all players (with optional filters & pagination)
// @route   GET /api/players
// @access  Private / Admin & Super Admin
const getAllPlayers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter from query params (exclude soft-deleted)
    const filter = { isDeleted: false };
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
    if (req.query.age_group) {
      filter.age_group = req.query.age_group;
    }
    if (req.query.preferredFoot) {
      filter.preferredFoot = req.query.preferredFoot;
    }

    const totalResults = await Player.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);
    const players = await Player.find(filter)
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      players,
      currentPage: page,
      totalPages,
      totalResults,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("Get players error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Search players by multiple criteria
// @route   GET /api/players/search
// @access  Private / Admin & Super Admin
const searchPlayers = async (req, res) => {
  try {
    const { name, city, age_group, position, gender } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build dynamic search query
    const filter = { isDeleted: false };
    const orConditions = [];

    if (name) {
      orConditions.push({ name: { $regex: name, $options: "i" } });
    }
    if (city) {
      orConditions.push({ city: { $regex: city, $options: "i" } });
    }
    if (position) {
      orConditions.push(
        { playingPosition: { $regex: position, $options: "i" } },
        { alternativePosition: { $regex: position, $options: "i" } }
      );
    }

    // Exact match filters
    if (age_group) {
      filter.age_group = age_group;
    }
    if (gender) {
      filter.gender = gender;
    }

    // Combine OR conditions if any exist
    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }

    // If no search criteria provided
    if (!name && !city && !age_group && !position && !gender) {
      return res.status(400).json({
        message: "Please provide at least one search parameter: name, city, age_group, position, or gender",
      });
    }

    const totalResults = await Player.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);
    const players = await Player.find(filter)
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: players.length,
      totalResults,
      totalPages,
      currentPage: page,
      players,
    });
  } catch (error) {
    console.error("Search players error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single player by ID
// @route   GET /api/players/:id
// @access  Private / Admin & Super Admin
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role");

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
    const player = await Player.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Update only provided fields
    const updatableFields = [
      "name",
      "age",
      "age_group",
      "playingPosition",
      "alternativePosition",
      "preferredFoot",
      "transferMarketLink",
      "playerId",
      "dateOfBirth",
      "nationality",
      "weight",
      "height",
      "gender",
      "jersey_no",
      "size",
      "city",
      "address",
      "mobileNumber",
      "email",
      "profileImage",
      "scouting_notes",
      "career_history",
      "media_links",
      "clubsPlayed",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        player[field] = req.body[field];
      }
    });

    // Track who updated
    player.updatedBy = req.user._id;

    const updatedPlayer = await player.save();
    await updatedPlayer.populate("createdBy", "name email role");
    await updatedPlayer.populate("updatedBy", "name email role");

    // Log player update
    await logAction({
      user: req.user,
      action: "UPDATE",
      resourceType: "Player",
      resourceId: player._id.toString(),
      description: `Player updated: ${updatedPlayer.name} (ID: ${updatedPlayer.playerId})`,
      req,
      changes: req.body,
      status: "SUCCESS"
    });

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
    const player = await Player.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Soft delete
    player.isDeleted = true;
    player.updatedBy = req.user._id;
    await player.save();

    // Log player deletion
    await logAction({
      user: req.user,
      action: "DELETE",
      resourceType: "Player",
      resourceId: player._id.toString(),
      description: `Player deleted (soft): ${player.name} (ID: ${player.playerId})`,
      req,
      changes: { isDeleted: true },
      status: "SUCCESS"
    });

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Delete player error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPlayer,
  getAllPlayers,
  searchPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
};
