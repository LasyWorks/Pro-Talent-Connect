const Admin = require("../Models/Admin");
const generateToken = require("../services/generateToken");
const { logAction } = require("../Middleware/auditLogger");

// @desc    List all admin accounts
// @route   GET /api/admins
// @access  Private / Super Admin only
const getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};

    // Filter by role
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Filter by active status
    if (req.query.is_active !== undefined) {
      filter.is_active = req.query.is_active === "true";
    }

    // Search by name or email
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const totalResults = await Admin.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);

    const admins = await Admin.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: admins.length,
      totalResults,
      totalPages,
      currentPage: page,
      admins,
    });
  } catch (error) {
    console.error("Get all admins error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new admin account
// @route   POST /api/admins
// @access  Private / Super Admin only
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, profile_image } = req.body;

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
      role: role || "Admin",
      profile_image: profile_image || "",
      is_active: true,
    });

    // Log admin creation
    await logAction({
      user: req.admin,
      action: "CREATE",
      resourceType: "Admin",
      resourceId: admin._id.toString(),
      description: `Admin account created: ${admin.name} (${admin.email}) with role ${admin.role}`,
      req,
      changes: { name, email, role: admin.role, is_active: true },
      status: "SUCCESS"
    });

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profile_image: admin.profile_image,
        is_active: admin.is_active,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    View admin profile by ID
// @route   GET /api/admins/:id
// @access  Private / Super Admin only
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Get admin by ID error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update admin details
// @route   PUT /api/admins/:id
// @access  Private / Super Admin only
const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update only provided fields (excluding password and critical fields)
    const updatableFields = ["name", "email", "role", "profile_image", "is_active"];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        admin[field] = req.body[field];
      }
    });

    // Validate role if provided
    if (req.body.role && !["Admin", "Super Admin"].includes(req.body.role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be 'Admin' or 'Super Admin'" });
    }

    // Prevent demoting the last Super Admin
    if (req.body.role === "Admin" && admin.role === "Super Admin") {
      const superAdminCount = await Admin.countDocuments({ role: "Super Admin" });
      if (superAdminCount <= 1) {
        return res
          .status(403)
          .json({ message: "Cannot demote the last Super Admin" });
      }
    }

    const updatedAdmin = await admin.save();

    // Log admin update
    await logAction({
      user: req.admin,
      action: "UPDATE",
      resourceType: "Admin",
      resourceId: admin._id.toString(),
      description: `Admin details updated for ${updatedAdmin.name}`,
      req,
      changes: req.body,
      status: "SUCCESS"
    });

    res.status(200).json({
      success: true,
      message: "Admin details updated successfully",
      admin: {
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        profile_image: updatedAdmin.profile_image,
        is_active: updatedAdmin.is_active,
        last_login: updatedAdmin.last_login,
        updatedAt: updatedAdmin.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update admin error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Demote admin or deactivate account
// @route   PATCH /api/admins/:id/demote
// @access  Private / Super Admin only
const demoteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if demoting from Super Admin
    if (admin.role === "Super Admin") {
      const superAdminCount = await Admin.countDocuments({ role: "Super Admin" });
      if (superAdminCount <= 1) {
        return res
          .status(403)
          .json({ message: "Cannot demote the last Super Admin" });
      }
      admin.role = "Admin";
    }

    // Deactivate account
    admin.is_active = false;

    const oldRole = admin.role === "Admin" ? "Admin" : "Super Admin";
    await admin.save();

    // Log admin demotion
    await logAction({
      user: req.admin,
      action: "UPDATE",
      resourceType: "Admin",
      resourceId: admin._id.toString(),
      description: `Admin demoted and deactivated: ${admin.name} (from ${oldRole} to ${admin.role})`,
      req,
      changes: { role: admin.role, is_active: false },
      status: "SUCCESS"
    });

    res.status(200).json({
      success: true,
      message: "Admin demoted and deactivated successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        is_active: admin.is_active,
      },
    });
  } catch (error) {
    console.error("Demote admin error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete admin account
// @route   DELETE /api/admins/:id
// @access  Private / Super Admin only
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent deleting the last Super Admin
    if (admin.role === "Super Admin") {
      const superAdminCount = await Admin.countDocuments({ role: "Super Admin" });
      if (superAdminCount <= 1) {
        return res
          .status(403)
          .json({ message: "Cannot delete the last Super Admin" });
      }
    }

    // Prevent deleting yourself
    if (req.admin._id.toString() === admin._id.toString()) {
      return res
        .status(403)
        .json({ message: "Cannot delete your own account" });
    }

    await Admin.findByIdAndDelete(req.params.id);

    // Log admin deletion
    await logAction({
      user: req.admin,
      action: "DELETE",
      resourceType: "Admin",
      resourceId: admin._id.toString(),
      description: `Admin account deleted: ${admin.name} (${admin.email})`,
      req,
      changes: { deleted_admin: { name: admin.name, email: admin.email, role: admin.role } },
      status: "SUCCESS"
    });

    res.status(200).json({
      success: true,
      message: "Admin account deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllAdmins,
  createAdmin,
  getAdminById,
  updateAdmin,
  demoteAdmin,
  deleteAdmin,
};
