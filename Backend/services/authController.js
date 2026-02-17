const Admin = require("../Models/Admin");
const generateToken = require("../services/generateToken");
const { logAction } = require("../Middleware/auditLogger");

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
      // Log failed login attempt
      await logAction({
        user: { email },
        action: "LOGIN",
        resourceType: "Auth",
        description: `Failed login attempt for email: ${email}`,
        req,
        status: "FAILURE"
      });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is active
    if (!admin.is_active) {
      // Log failed login due to inactive account
      await logAction({
        user: admin,
        action: "LOGIN",
        resourceType: "Auth",
        description: `Login attempt on deactivated account: ${admin.email}`,
        req,
        status: "FAILURE"
      });
      return res.status(403).json({ message: "Account is deactivated. Contact administrator" });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      // Log failed login attempt
      await logAction({
        user: admin,
        action: "LOGIN",
        resourceType: "Auth",
        description: `Failed login attempt with incorrect password for: ${admin.email}`,
        req,
        status: "FAILURE"
      });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login timestamp
    admin.last_login = new Date();
    await admin.save();

    // Log successful login
    await logAction({
      user: admin,
      action: "LOGIN",
      resourceType: "Auth",
      description: `Admin ${admin.name} logged in successfully`,
      req,
      status: "SUCCESS"
    });

    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      profile_image: admin.profile_image,
      is_active: admin.is_active,
      last_login: admin.last_login,
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

    // Log admin registration
    await logAction({
      user: req.admin,
      action: "CREATE",
      resourceType: "Admin",
      resourceId: admin._id.toString(),
      description: `New admin registered: ${admin.name} (${admin.email}) with role ${admin.role}`,
      req,
      changes: { name, email, role: admin.role },
      status: "SUCCESS"
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
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide current and new password" });
    }

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify current password
    const isMatch = await admin.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Set new password (will be hashed by pre-save hook)
    admin.password = newPassword;
    await admin.save();

    // Log password change
    await logAction({
      user: admin,
      action: "PASSWORD_CHANGE",
      resourceType: "Auth",
      resourceId: admin._id.toString(),
      description: `Admin ${admin.name} changed password`,
      req,
      status: "SUCCESS"
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update admin role
// @route   PUT /api/auth/admin/:id/role
// @access  Private / Super Admin only
const updateAdminRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !["Admin", "Super Admin"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid role (Admin or Super Admin)" });
    }

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent demoting yourself if you're the last Super Admin
    if (req.admin._id.toString() === admin._id.toString() && role === "Admin") {
      const superAdminCount = await Admin.countDocuments({ role: "Super Admin" });
      if (superAdminCount <= 1) {
        return res
          .status(403)
          .json({ message: "Cannot demote the last Super Admin" });
      }
    }

    const oldRole = admin.role;
    admin.role = role;
    await admin.save();

    // Log role change
    await logAction({
      user: req.admin,
      action: "ROLE_CHANGE",
      resourceType: "Admin",
      resourceId: admin._id.toString(),
      description: `Admin role updated from ${oldRole} to ${role} for ${admin.name}`,
      req,
      changes: { oldRole, newRole: role },
      status: "SUCCESS"
    });

    res.status(200).json({
      message: `Admin role updated to ${role} successfully`,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Update admin role error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Private
const logoutAdmin = async (req, res) => {
  try {
    // Log logout action
    await logAction({
      user: req.admin,
      action: "LOGOUT",
      resourceType: "Auth",
      description: `Admin ${req.admin.name} logged out`,
      req,
      status: "SUCCESS"
    });

    // Since we're using stateless JWT, logout is handled client-side
    // This endpoint confirms logout action
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Refresh JWT token
// @route   POST /api/auth/refresh
// @access  Private
const refreshToken = async (req, res) => {
  try {
    // req.admin is already verified by protect middleware
    const admin = await Admin.findById(req.admin._id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if account is still active
    if (!admin.is_active) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // Generate new token
    const newToken = generateToken(admin._id, admin.role);

    res.status(200).json({
      success: true,
      token: newToken,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profile_image: admin.profile_image,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginAdmin, registerAdmin, getProfile, changePassword, updateAdminRole, logoutAdmin, refreshToken, logoutAdmin, refreshToken };
