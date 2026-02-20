// Script to insert player data directly into the database
// Run: node services/insertPlayers.js

require("dotenv").config();
const mongoose = require("mongoose");
const Player = require("../Models/Players");
const connectDB = require("../config/DB");
const { calculateScoutReport } = require("./scoutReportCalculator");

const playersToInsert = [
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
        result: "Champion",
      },
      {
        name: "Assam Premier League",
        type: "State League",
        year: 2025,
        result: "Participant",
      },
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
        duration: "2018-2020",
      },
      {
        clubName: "Elevenstar Bongaigaon FC Assam",
        clubLogo: "",
        duration: "2020",
      },
      {
        clubName: "MRU FC Bengaluru",
        clubLogo: "",
        duration: "2021-2022",
      },
      {
        clubName: "Bangalore United FC",
        clubLogo: "",
        duration: "2022-2023",
      },
      {
        clubName: "Amlan Ghusti Nagaon FC",
        clubLogo: "",
        duration: "2024",
      },
      {
        clubName: "Jorhat Town Club FC",
        clubLogo: "",
        duration: "2025",
      },
    ],
    createdBy: null,
    updatedBy: null,
    isDeleted: false,
    featured: false,
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
        result: "Participant",
      },
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
        duration: "2021-2022",
      },
    ],
    createdBy: null,
    updatedBy: null,
    isDeleted: false,
    featured: false,
  },
];

const insertPlayers = async () => {
  try {
    await connectDB();

    console.log("Checking for existing players with same email or playerId...");
    
    // Check if players already exist
    for (const playerData of playersToInsert) {
      const existing = await Player.findOne({
        $or: [
          { email: playerData.email },
          { playerId: playerData.playerId }
        ],
        isDeleted: false
      });

      if (existing) {
        console.log(`⚠️  Player already exists: ${playerData.name} (${playerData.email})`);
        continue;
      }

      // Calculate scout report
      try {
        playerData.scoutReport = calculateScoutReport({
          age: playerData.age,
          height: playerData.height,
          weight: playerData.weight,
          playingPosition: playerData.playingPosition,
          transferMarketLink: playerData.transferMarketLink,
          competitions: playerData.competitions,
          stateLeague: playerData.stateLeague,
          clubTier: playerData.clubTier,
          sprint30m: playerData.sprint30m,
          mentalityScore: playerData.mentalityScore,
        });
      } catch (error) {
        console.error(`Error calculating scout report for ${playerData.name}:`, error.message);
        // Use default empty scout report
        playerData.scoutReport = {
          ageScore: 0,
          physicalScore: 0,
          transferMarketScore: 0,
          competitionScore: 0,
          championshipBonus: 0,
          stateLeagueBonus: 0,
          clubReputationBonus: 0,
          speedScore: 0,
          mentalityAssessment: 0,
          totalScore: 0,
          grade: "",
        };
      }

      // Insert player
      const player = await Player.create(playerData);
      console.log(`✅ Player inserted: ${player.name} (ID: ${player.playerId})`);
      console.log(`   Scout Report - Total Score: ${player.scoutReport.totalScore}, Grade: ${player.scoutReport.grade}`);
    }

    console.log("\n✅ Player insertion completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting players:", error.message);
    console.error(error);
    process.exit(1);
  }
};

insertPlayers();
