const Enquiry = require("../Models/Enquiry");
const ProfileRequest = require("../Models/ProfileRequest");

// Submit enquiry form
const submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully. We'll get back to you soon!",
      enquiry,
    });
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting enquiry",
      error: error.message,
    });
  }
};

// Submit profile creation request
const submitProfileRequest = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      nationality,
      city,
      playingPosition,
      preferredFoot,
      height,
      weight,
      currentClub,
      yearsOfExperience,
      achievements,
      videoLink,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !dateOfBirth ||
      !nationality ||
      !city ||
      !playingPosition ||
      !preferredFoot ||
      !height ||
      !weight ||
      !yearsOfExperience
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const profileRequest = await ProfileRequest.create({
      fullName,
      email,
      phone,
      dateOfBirth,
      nationality,
      city,
      playingPosition,
      preferredFoot,
      height,
      weight,
      currentClub,
      yearsOfExperience,
      achievements,
      videoLink,
    });

    res.status(201).json({
      success: true,
      message:
        "Profile creation request submitted successfully! Our team will review your information and contact you within 2-3 business days.",
      profileRequest,
    });
  } catch (error) {
    console.error("Error submitting profile request:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting profile request",
      error: error.message,
    });
  }
};

// Get all enquiries (Admin only)
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching enquiries",
      error: error.message,
    });
  }
};

// Get all profile requests (Admin only)
const getAllProfileRequests = async (req, res) => {
  try {
    const requests = await ProfileRequest.find({ isDeleted: false }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error fetching profile requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile requests",
      error: error.message,
    });
  }
};

// Update enquiry status (Admin only)
const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry status updated",
      enquiry,
    });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Error updating enquiry",
      error: error.message,
    });
  }
};

// Update profile request status (Admin only)
const updateProfileRequestStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const updateData = { status };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const request = await ProfileRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Profile request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile request updated",
      request,
    });
  } catch (error) {
    console.error("Error updating profile request:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile request",
      error: error.message,
    });
  }
};

module.exports = {
  submitEnquiry,
  submitProfileRequest,
  getAllEnquiries,
  getAllProfileRequests,
  updateEnquiryStatus,
  updateProfileRequestStatus,
};
