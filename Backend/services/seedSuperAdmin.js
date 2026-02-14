// Run once to create the first Super Admin:
//   node services/seedSuperAdmin.js

require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../Models/Admin");
const connectDB = require("../config/DB");

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    const existing = await Admin.findOne({ role: "Super Admin" });
    if (existing) {
      console.log("Super Admin already exists:", existing.email);
      process.exit(0);
    }

    const superAdmin = await Admin.create({
      name: "Super Admin",
      email: "superadmin@protalent.com",
      password: "SuperAdmin@123", // change after first login
      role: "Super Admin",
    });

    console.log("Super Admin created successfully!");
    console.log(`  Email:    ${superAdmin.email}`);
    console.log(`  Password: SuperAdmin@123`);
    console.log("  (change the password after first login)");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedSuperAdmin();
