const About = require("../Models/About");
const { logAction } = require("../Middleware/auditLogger");

// @desc    Get organisation profile
// @route   GET /api/about
// @access  Public
const getAbout = async (req, res) => {
  try {
    // Get the singleton document, create if doesn't exist
    const about = await About.getSingleton();

    res.status(200).json({
      success: true,
      about,
    });
  } catch (error) {
    console.error("Get about error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update organisation profile
// @route   PUT /api/about
// @access  Private / Super Admin only
const updateAbout = async (req, res) => {
  try {
    // Get the singleton document
    const about = await About.getSingleton();

    // Update only provided fields
    const updatableFields = [
      "org_name",
      "mission",
      "history",
      "credentials",
      "contact_email",
      "contact_phone",
      "location",
      "images",
      "social_links",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        about[field] = req.body[field];
      }
    });

    const updatedAbout = await about.save();

    // Log about profile update
    await logAction({
      user: req.user || req.admin,
      action: "UPDATE",
      resourceType: "About",
      resourceId: updatedAbout._id.toString(),
      description: `Organisation profile updated`,
      req,
      changes: req.body,
      status: "SUCCESS"
    });

    res.status(200).json({
      success: true,
      message: "Organisation profile updated successfully",
      about: updatedAbout,
    });
  } catch (error) {
    console.error("Update about error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Upload/Add new gallery images
// @route   POST /api/about/images
// @access  Private / Super Admin only
const uploadImages = async (req, res) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of image URLs",
      });
    }

    // Get the singleton document
    const about = await About.getSingleton();

    // Add new images to existing array (avoid duplicates)
    images.forEach((imageUrl) => {
      if (!about.images.includes(imageUrl)) {
        about.images.push(imageUrl);
      }
    });

    const updatedAbout = await about.save();

    // Log image upload
    await logAction({
      user: req.user || req.admin,
      action: "UPDATE",
      resourceType: "About",
      resourceId: updatedAbout._id.toString(),
      description: `Added ${images.length} image(s) to organisation gallery`,
      req,
      changes: { images_added: images },
      status: "SUCCESS"
    });

    res.status(200).json({
      success: true,
      message: `${images.length} image(s) added to gallery`,
      about: updatedAbout,
    });
  } catch (error) {
    console.error("Upload images error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAbout,
  updateAbout,
  uploadImages,
};
