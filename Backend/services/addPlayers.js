// Add specific players to database
// Run: node services/addPlayers.js

require("dotenv").config();
const mongoose = require("mongoose");
const Player = require("../Models/Players");
const Admin = require("../Models/Admin");
const connectDB = require("../config/DB");

const playersToAdd = [
  {
    name: "SUBHAM JYOTI DAS",
    age: 22,
    age_group: "Senior",
    playingPosition: "DEFENDER",
    alternativePosition: "",
    preferredFoot: "Right",
    transferMarketLink: "",
    playerId: "PL0000106125",
    dateOfBirth: "2003-09-13T00:00:00.000Z",
    nationality: "Indian",
    weight: 61,
    height: 172,
    gender: "Male",
    jersey_no: 0,
    size: "M",
    city: "Assam",
    address: "Assam, India",
    mobileNumber: "8473044882",
    email: "subhamjunior367@gmail.com",
    profileImage: "",
    scouting_notes: "",
    career_history: "",
    media_links: [],
    plId: "PL0000106125",
    competitions: [
      {
        name: "Nagaon A Division League",
        type: "State League",
        year: 2024,
        result: "Champion"
      },
      {
        name: "Assam Premier League",
        type: "State League",
        year: 2025,
        result: "Participant"
      }
    ],
    stateLeague: "Assam PL",
    clubTier: "",
    sprint30m: 4.1,
    sprint50m: 0,
    mentalityScore: 1,
    clubsPlayed: [
      {
        clubName: "United Punjab FC",
        clubLogo: "",
        duration: "2018-2020"
      },
      {
        clubName: "Elevenstar Bongaigaon FC Assam",
        clubLogo: "",
        duration: "2020"
      },
      {
        clubName: "MRU FC Bengaluru",
        clubLogo: "",
        duration: "2021-2022"
      },
      {
        clubName: "Bangalore United FC",
        clubLogo: "",
        duration: "2022-2023"
      },
      {
        clubName: "Amlan Ghusti Nagaon FC",
        clubLogo: "",
        duration: "2024"
      },
      {
        clubName: "Jorhat Town Club FC",
        clubLogo: "",
        duration: "2025"
      }
    ],
    featured: false
  },
  {
    name: "VIKRAM",
    age: 22,
    age_group: "Senior",
    playingPosition: "FORWARD",
    alternativePosition: "",
    preferredFoot: "Right",
    transferMarketLink: "",
    playerId: "TEMP-VIKRAM-001",
    dateOfBirth: "2003-06-08T00:00:00.000Z",
    nationality: "Indian",
    weight: 63,
    height: 172,
    gender: "Male",
    jersey_no: 0,
    size: "M",
    city: "Haryana",
    address: "Haryana, India",
    mobileNumber: "8683818100",
    email: "messivikram3@gmail.com",
    profileImage: "",
    scouting_notes: "",
    career_history: "",
    media_links: [],
    plId: "",
    competitions: [
      {
        name: "Bodusa Cup",
        type: "Other",
        year: 2021,
        result: "Participant"
      }
    ],
    stateLeague: "",
    clubTier: "",
    sprint30m: 12,
    sprint50m: 0,
    mentalityScore: 1,
    clubsPlayed: [
      {
        clubName: "Rajasthan United FC",
        clubLogo: "",
        duration: "2021-2022"
      }
    ],
    featured: false
  }
];

const addPlayers = async () => {
  try {
    await connectDB();

    // Find admin to use as creator
    const admin = await Admin.findOne();
    if (!admin) {
      console.error("❌ No admin found. Please run seedSuperAdmin.js first.");
      process.exit(1);
    }

    let addedCount = 0;
    let skippedCount = 0;

    for (const playerData of playersToAdd) {
      // Check if player already exists
      const existing = await Player.findOne({ 
        $or: [
          { playerId: playerData.playerId },
          { email: playerData.email }
        ]
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${playerData.name} (${playerData.playerId}) - Already exists`);
        skippedCount++;
        continue;
      }

      // Add admin references
      const playerWithAdmin = {
        ...playerData,
        createdBy: admin._id,
        updatedBy: admin._id
      };

      const player = await Player.create(playerWithAdmin);
      console.log(`✅ Added: ${player.name} (${player.playerId})`);
      addedCount++;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - Added: ${addedCount} players`);
    console.log(`   - Skipped: ${skippedCount} players (duplicates)`);
    console.log(`   - Total: ${playersToAdd.length} players processed`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed:", error.message);
    console.error(error);
    process.exit(1);
  }
};

addPlayers();
