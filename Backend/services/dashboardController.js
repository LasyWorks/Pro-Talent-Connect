const Player = require("../Models/Players");
const Admin = require("../Models/Admin");

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private / Admin & Super Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalPlayers, totalAdmins, activePlayers, deletedPlayers] =
      await Promise.all([
        Player.countDocuments(),
        Admin.countDocuments(),
        Player.countDocuments({ isDeleted: false }),
        Player.countDocuments({ isDeleted: true }),
      ]);

    res.status(200).json({
      totalPlayers,
      totalAdmins,
      activePlayers,
      deletedPlayers,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboardStats };
