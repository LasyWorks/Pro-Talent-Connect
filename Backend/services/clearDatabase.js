// Run to clear all data from database:
//   node services/clearDatabase.js

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/DB");

// Import all models
const Admin = require("../Models/Admin");
const Player = require("../Models/Players");
const Blog = require("../Models/Blog");
const Service = require("../Models/Service");
const HowItWork = require("../Models/HowItWork");
const About = require("../Models/About");
const Enquiry = require("../Models/Enquiry");
const ProfileRequest = require("../Models/ProfileRequest");
const AuditLog = require("../Models/AuditLog");

const clearDatabase = async () => {
  try {
    await connectDB();

    console.log("🗑️  Starting database cleanup...\n");

    // Delete all data from each collection
    await Admin.deleteMany({});
    console.log("✅ Cleared Admins");

    await Player.deleteMany({});
    console.log("✅ Cleared Players");

    await Blog.deleteMany({});
    console.log("✅ Cleared Blogs");

    await Service.deleteMany({});
    console.log("✅ Cleared Services");

    await HowItWork.deleteMany({});
    console.log("✅ Cleared How It Works");

    await About.deleteMany({});
    console.log("✅ Cleared About");

    await Enquiry.deleteMany({});
    console.log("✅ Cleared Enquiries");

    await ProfileRequest.deleteMany({});
    console.log("✅ Cleared Profile Requests");

    await AuditLog.deleteMany({});
    console.log("✅ Cleared Audit Logs");

    console.log("\n🎉 Database cleared successfully!");
    console.log("\nNow run:");
    console.log("  node services/seedSuperAdmin.js");
    console.log("  node services/seedPlayers.js");
    console.log("  node services/seedServices.js");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Clear failed:", error.message);
    process.exit(1);
  }
};

clearDatabase();
