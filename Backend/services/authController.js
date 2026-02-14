const Admin = require("../Models/Admin");
const generateToken = require("../services/generateToken");

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Register a new admin (Super Admin only)
// @route   POST /api/auth/register
// @access  Private / Super Admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || "Admin", // default role is Admin
    });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current admin profile and list all admins
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    // Get current admin profile
    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Get all admins with their roles
    const allAdmins = await Admin.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    // Separate admins by role
    const superAdmins = allAdmins.filter((a) => a.role === "Super Admin");
    const regularAdmins = allAdmins.filter((a) => a.role === "Admin");

    res.status(200).json({
      currentAdmin: admin,
      adminsList: {
        superAdmins: superAdmins,
        admins: regularAdmins,
        totalCount: allAdmins.length,
        superAdminCount: superAdmins.length,
        adminCount: regularAdmins.length,
      },
    });
  } catch (error) {
    console.error("Profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide old and new password" });
    }

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify old password
    const isMatch = await admin.matchPassword(oldPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Set new password (will be hashed by pre-save hook)
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginAdmin, registerAdmin, getProfile, changePassword };
