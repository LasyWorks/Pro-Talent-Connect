// Seed about page content
// Run: node services/seedAbout.js

require("dotenv").config();
const mongoose = require("mongoose");
const About = require("../Models/About");
const connectDB = require("../config/DB");

const aboutData = {
  org_name: "Pro-Talent-Connect",
  mission: "To bridge the gap between talented football players and professional opportunities, creating pathways for athletes to reach their full potential.",
  history: "Founded in 2023, Pro-Talent-Connect emerged from a vision to revolutionize football talent discovery in India. We recognized that countless talented players lacked visibility and access to professional opportunities. Our platform connects scouts, clubs, and players, creating a transparent ecosystem where talent meets opportunity. Over the past years, we've helped hundreds of players secure trials, contracts, and international exposure.",
  credentials: "Licensed by AIFF | FIFA Agent Network Member | Certified Youth Development Partner",
  contact_email: "info@protalent-connect.com",
  contact_phone: "+91-1234567890",
  location: "Mumbai, Maharashtra, India",
  images: [
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
    "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
  ],
  social_links: {
    instagram: "https://instagram.com/protalentconnect",
    facebook: "https://facebook.com/protalentconnect",
    twitter: "https://twitter.com/protalent_co",
    linkedin: "https://linkedin.com/company/pro-talent-connect"
  }
};

const seedAbout = async () => {
  try {
    await connectDB();

    // Clear existing about data
    await About.deleteMany({});
    console.log("🗑️  Existing about data cleared.");

    // Insert about data
    const about = await About.create(aboutData);

    console.log("\n✅ About page content seeded successfully!");
    console.log(`   Organisation: ${about.org_name}`);
    console.log(`   Email: ${about.contact_email}`);
    console.log(`   Location: ${about.location}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAbout();
