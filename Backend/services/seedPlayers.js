// Seed dummy player data
// Run: node services/seedPlayers.js

require("dotenv").config();
const mongoose = require("mongoose");
const Player = require("../Models/Players");
const Admin = require("../Models/Admin");
const connectDB = require("../config/DB");

// Pre-seeded sample data
const samplePlayers = [
  {
    name: "Rahul Kumar",
    playerId: "PTL2026001",
    email: "rahul.kumar@example.com",
    mobileNumber: "+91-9876543210",
    dateOfBirth: new Date("2006-03-15"),
    age: 19,
    age_group: "U19",
    gender: "Male",
    nationality: "Indian",
    city: "Mumbai",
    address: "Andheri West, Mumbai, Maharashtra",
    playingPosition: "Forward",
    alternativePosition: "Winger",
    preferredFoot: "Right",
    height: 178,
    weight: 72,
    jersey_no: 10,
    size: "M",
    transferMarketLink: "",
    profileImage: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400",
    scouting_notes: "Quick striker with excellent finishing ability. Shows maturity beyond his years.",
    career_history: "Started at Mumbai FC youth academy, moved to senior team in 2024.",
    plId: "",
    competitions: [
      { name: "Mumbai District League", type: "District League", year: 2024, result: "Champion" },
      { name: "State Youth League", type: "State Youth League", year: 2025, result: "Runner-up" }
    ],
    stateLeague: "Mumbai Elite",
    clubTier: "Tier 2",
    sprint30m: 4.2,
    sprint50m: 6.8,
    mentalityScore: 2,
    clubsPlayed: [
      { clubName: "Mumbai FC", clubLogo: "", duration: "2022-Present" }
    ],
    featured: true,
  },
  {
    name: "Arjun Singh",
    playerId: "PTL2026002",
    email: "arjun.singh@example.com",
    mobileNumber: "+91-9876543211",
    dateOfBirth: new Date("2005-07-22"),
    age: 20,
    age_group: "Senior",
    gender: "Male",
    nationality: "Indian",
    city: "Delhi",
    address: "Rohini, New Delhi",
    playingPosition: "Midfielder",
    alternativePosition: "Defensive Midfielder",
    preferredFoot: "Both",
    height: 175,
    weight: 70,
    jersey_no: 8,
    size: "M",
    transferMarketLink: "",
    profileImage: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400",
    scouting_notes: "Excellent vision and passing range. Strong defensive work rate.",
    career_history: "Delhi FC youth academy graduate, promoted to senior squad in 2023.",
    plId: "",
    competitions: [
      { name: "I-League 3", type: "I-League 3", year: 2024, result: "Third" },
      { name: "National Youth Championships", type: "National Youth Championships", year: 2023, result: "Participant" }
    ],
    stateLeague: "Delhi PL",
    clubTier: "Tier 2",
    sprint30m: 4.5,
    sprint50m: 7.1,
    mentalityScore: 2,
    clubsPlayed: [
      { clubName: "Delhi FC", clubLogo: "", duration: "2021-Present" }
    ],
    featured: true,
  },
  {
    name: "Vikram Reddy",
    playerId: "PTL2026003",
    email: "vikram.reddy@example.com",
    mobileNumber: "+91-9876543212",
    dateOfBirth: new Date("2007-11-08"),
    age: 18,
    age_group: "U19",
    gender: "Male",
    nationality: "Indian",
    city: "Hyderabad",
    address: "Banjara Hills, Hyderabad, Telangana",
    playingPosition: "Defender",
    alternativePosition: "Center Back",
    preferredFoot: "Right",
    height: 183,
    weight: 76,
    jersey_no: 4,
    size: "L",
    transferMarketLink: "",
    profileImage: "https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?w=400",
    scouting_notes: "Solid defender with good aerial ability. Natural leader on the pitch.",
    career_history: "Hyderabad Youth Academy, consistently strong performances.",
    plId: "",
    competitions: [
      { name: "State Youth League", type: "State Youth League", year: 2025, result: "Champion" },
      { name: "Santosh Trophy", type: "Santosh Trophy", year: 2024, result: "Participant" }
    ],
    stateLeague: "",
    clubTier: "Tier 3",
    sprint30m: 4.8,
    sprint50m: 7.5,
    mentalityScore: 2,
    clubsPlayed: [
      { clubName: "Hyderabad FC Youth", clubLogo: "", duration: "2023-Present" }
    ],
    featured: false,
  },
  {
    name: "Priya Sharma",
    playerId: "PTL2026004",
    email: "priya.sharma@example.com",
    mobileNumber: "+91-9876543213",
    dateOfBirth: new Date("2006-05-19"),
    age: 19,
    age_group: "U19",
    gender: "Female",
    nationality: "Indian",
    city: "Bangalore",
    address: "Indiranagar, Bangalore, Karnataka",
    playingPosition: "Forward",
    alternativePosition: "Attacking Midfielder",
    preferredFoot: "Left",
    height: 165,
    weight: 58,
    jersey_no: 11,
    size: "S",
    transferMarketLink: "",
    profileImage: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400",
    scouting_notes: "Dynamic attacker with exceptional dribbling skills. High football IQ.",
    career_history: "Bangalore Women's FC, top scorer in youth category for 2 consecutive years.",
    plId: "",
    competitions: [
      { name: "National Youth Championships", type: "National Youth Championships", year: 2025, result: "Runner-up" },
      { name: "State Youth League", type: "State Youth League", year: 2024, result: "Champion" }
    ],
    stateLeague: "BDFA Super Division",
    clubTier: "Tier 2",
    sprint30m: 4.3,
    sprint50m: 6.9,
    mentalityScore: 2,
    clubsPlayed: [
      { clubName: "Bangalore Women's FC", clubLogo: "", duration: "2022-Present" }
    ],
    featured: true,
  },
  {
    name: "Aditya Patel",
    playerId: "PTL2026005",
    email: "aditya.patel@example.com",
    mobileNumber: "+91-9876543214",
    dateOfBirth: new Date("2008-01-30"),
    age: 18,
    age_group: "U19",
    gender: "Male",
    nationality: "Indian",
    city: "Ahmedabad",
    address: "Vastrapur, Ahmedabad, Gujarat",
    playingPosition: "Goalkeeper",
    alternativePosition: "",
    preferredFoot: "Right",
    height: 186,
    weight: 78,
    jersey_no: 1,
    size: "L",
    transferMarketLink: "",
    profileImage: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400",
    scouting_notes: "Commanding presence in goal. Excellent reflexes and distribution.",
    career_history: "Gujarat United youth system, captained U17 team.",
    plId: "",
    competitions: [
      { name: "State Youth League", type: "State Youth League", year: 2025, result: "Third" },
      { name: "District League", type: "District League", year: 2024, result: "Champion" }
    ],
    stateLeague: "",
    clubTier: "Tier 3",
    sprint30m: 5.1,
    sprint50m: 7.8,
    mentalityScore: 2,
    clubsPlayed: [
      { clubName: "Gujarat United", clubLogo: "", duration: "2021-Present" }
    ],
    featured: false,
  },
];

const seedPlayers = async () => {
  try {
    await connectDB();
    
    // Find first admin to use as creator
    const admin = await Admin.findOne();
    if (!admin) {
      console.error("No admin found. Please run seedSuperAdmin.js first.");
      process.exit(1);
    }

    // Clear existing players (optional - comment out if you want to keep existing)
    // await Player.deleteMany({});
    // console.log("Existing players cleared.");

    // Add admin reference to each player
    const playersWithAdmin = samplePlayers.map(player => ({
      ...player,
      createdBy: admin._id,
      updatedBy: admin._id
    }));

    // Insert players
    const players = await Player.insertMany(playersWithAdmin);
    
    console.log(`✅ ${players.length} sample players seeded successfully!`);
    console.log("\nPlayers created:");
    players.forEach(player => {
      console.log(`  - ${player.name} (${player.playerId}) - ${player.age_group} ${player.playingPosition}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedPlayers();
