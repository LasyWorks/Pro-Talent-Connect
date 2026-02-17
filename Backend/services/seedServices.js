require('dotenv').config();
const mongoose = require("mongoose");
const Service = require("../Models/Service");
const HowItWork = require("../Models/HowItWork");
const Admin = require("../Models/Admin");
const connectDB = require("../config/DB");

const seedServicesAndSteps = async () => {
  try {
    await connectDB();

    // Find or create admin
    let admin = await Admin.findOne({ role: "super_admin" });
    if (!admin) {
      admin = await Admin.findOne();
    }

    console.log("🌱 Seeding Services and How It Works...");

    // Clear existing data
    await Service.deleteMany({});
    await HowItWork.deleteMany({});

    // Services data
    const services = [
      {
        title: "Player Discovery",
        description: "Access our comprehensive database of professional football players with detailed profiles, statistics, and performance metrics to find the perfect talent.",
        icon: "MagnifyingGlassIcon",
        color: "red",
        order: 1,
        createdBy: admin?._id,
      },
      {
        title: "Profile Management",
        description: "Players can create and maintain a flexible platform showcasing their skills, achievements, career history, and highlight reels.",
        icon: "UserCircleIcon",
        color: "blue",
        order: 2,
        createdBy: admin?._id,
      },
      {
        title: "Career Analytics",
        description: "Track player statistics, performance metrics, and career progression with our advanced analytics and reporting tools.",
        icon: "ChartBarIcon",
        color: "green",
        order: 3,
        createdBy: admin?._id,
      },
      {
        title: "Achievement Tracking",
        description: "Document and showcase individual awards, team accomplishments, and career milestones in one centralized format.",
        icon: "TrophyIcon",
        color: "yellow",
        order: 4,
        createdBy: admin?._id,
      },
      {
        title: "Verified Profiles",
        description: "All player profiles are verified to ensure the accuracy and authenticity of information for peace of mind in scouting.",
        icon: "ShieldCheckIcon",
        color: "purple",
        order: 5,
        createdBy: admin?._id,
      },
      {
        title: "Dedicated Support",
        description: "Our team provides excellent support to players, scouts, and clubs to ensure the best experience on the platform.",
        icon: "LifebuoyIcon",
        color: "pink",
        order: 6,
        createdBy: admin?._id,
      },
    ];

    // How It Works data
    const howItWorks = [
      {
        title: "Create Profile",
        description: "Players submit their information, career history, and highlight reel through our user-friendly profile creation form.",
        stepNumber: 1,
        icon: "UserPlusIcon",
        color: "red",
        order: 1,
        createdBy: admin?._id,
      },
      {
        title: "Verification",
        description: "Our team reviews and verifies all submitted information to ensure accuracy and authenticity.",
        stepNumber: 2,
        icon: "CheckBadgeIcon",
        color: "blue",
        order: 2,
        createdBy: admin?._id,
      },
      {
        title: "Get Discovered",
        description: "Profiles are live in our database, making it easier for clubs and scouts to discover opportunities worldwide.",
        stepNumber: 3,
        icon: "MagnifyingGlassIcon",
        color: "green",
        order: 3,
        createdBy: admin?._id,
      },
    ];

    // Insert data
    await Service.insertMany(services);
    await HowItWork.insertMany(howItWorks);

    console.log("✅ Successfully seeded:");
    console.log(`   - ${services.length} services`);
    console.log(`   - ${howItWorks.length} how it works steps`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedServicesAndSteps();
