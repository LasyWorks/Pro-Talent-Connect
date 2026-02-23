const Otp = require("../Models/Otp");
const Admin = require("../Models/Admin");
const { generateOTP, sendOTPEmail } = require("./emailService");

const OTP_EXPIRY_MINUTES = 10;

// ────────────────────────────────────────────────────
//  Send OTP for Player Creation
// ────────────────────────────────────────────────────
// @desc    Send OTP to the player's email before creating profile
// @route   POST /api/otp/send-player-otp
// @access  Private / Super Admin
const sendPlayerOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Invalidate any previous OTPs for this email + purpose
    await Otp.deleteMany({ email, purpose: "player-creation" });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.create({ email, otp, purpose: "player-creation", expiresAt });

    await sendOTPEmail(email, otp, "player-creation");

    res.status(200).json({ message: "OTP sent to player's email successfully" });
  } catch (error) {
    console.error("Send player OTP error:", error.message);
    const msg = error.message.includes("Email not configured")
      ? "Email service is not configured on the server. Contact admin."
      : error.message.includes("Invalid login") || error.message.includes("auth")
        ? "Email authentication failed. Check EMAIL_USER and EMAIL_PASS (must be a Gmail App Password)."
        : "Failed to send OTP. Please try again.";
    res.status(500).json({ message: msg });
  }
};

// ────────────────────────────────────────────────────
//  Verify OTP for Player Creation
// ────────────────────────────────────────────────────
// @desc    Verify OTP before allowing player profile creation
// @route   POST /api/otp/verify-player-otp
// @access  Private / Super Admin
const verifyPlayerOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const record = await Otp.findOne({
      email,
      otp,
      purpose: "player-creation",
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark as verified
    record.verified = true;
    await record.save();

    res.status(200).json({ message: "OTP verified successfully", verified: true });
  } catch (error) {
    console.error("Verify player OTP error:", error.message);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

// ────────────────────────────────────────────────────
//  Send OTP for Change Password
// ────────────────────────────────────────────────────
// @desc    Send OTP to admin's email before changing password
// @route   POST /api/otp/send-password-otp
// @access  Private
const sendPasswordOtp = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Invalidate any previous OTPs for this email + purpose
    await Otp.deleteMany({ email: admin.email, purpose: "change-password" });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.create({
      email: admin.email,
      otp,
      purpose: "change-password",
      expiresAt,
    });

    await sendOTPEmail(admin.email, otp, "change-password");

    res.status(200).json({ message: "OTP sent to your email successfully" });
  } catch (error) {
    console.error("Send password OTP error:", error.message);
    // Return a helpful error message
    const msg = error.message.includes("Email not configured")
      ? "Email service is not configured on the server. Contact admin."
      : error.message.includes("Invalid login") || error.message.includes("auth")
        ? "Email authentication failed. Check EMAIL_USER and EMAIL_PASS (must be a Gmail App Password)."
        : "Failed to send OTP. Please try again.";
    res.status(500).json({ message: msg });
  }
};

// ────────────────────────────────────────────────────
//  Verify OTP for Change Password
// ────────────────────────────────────────────────────
// @desc    Verify OTP before allowing password change
// @route   POST /api/otp/verify-password-otp
// @access  Private
const verifyPasswordOtp = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const record = await Otp.findOne({
      email: admin.email,
      otp,
      purpose: "change-password",
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark as verified
    record.verified = true;
    await record.save();

    res.status(200).json({ message: "OTP verified successfully", verified: true });
  } catch (error) {
    console.error("Verify password OTP error:", error.message);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

module.exports = {
  sendPlayerOtp,
  verifyPlayerOtp,
  sendPasswordOtp,
  verifyPasswordOtp,
};
