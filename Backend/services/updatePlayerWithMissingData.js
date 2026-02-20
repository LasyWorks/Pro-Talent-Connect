// Update a player with minimal data to test missing data handling
// Run: node services/updatePlayerWithMissingData.js

require("dotenv").config();
const mongoose = require("mongoose");
const Player = require("../Models/Players");
const { calculateScoutReport } = require("../services/scoutReportCalculator");
const connectDB = require("../config/DB");

const updatePlayer = async () => {
  try {
    await connectDB();

    // Find VIKRAM player
    const player = await Player.findOne({ playerId: "TEMP-VIKRAM-001" });

    if (!player) {
      console.error("❌ Player not found");
      process.exit(1);
    }

    console.log(`Found: ${player.name} (${player.playerId})`);
    console.log(`Current Score: ${player.scoutReport.totalScore} | Grade: ${player.scoutReport.grade}\n`);

    // Update with minimal data (setting most fields to missing/null)
    player.height = null;
    player.weight = null;
    player.transferMarketLink = "";
    player.competitions = [];
    player.stateLeague = "";
    player.clubTier = "";
    player.sprint30m = 0;
    player.sprint50m = 0;
    player.mentalityScore = 0;
    player.scouting_notes = "Incomplete profile - awaiting additional information";

    // Recalculate scout report with missing data
    player.scoutReport = calculateScoutReport({
      age: player.age,
      height: player.height,
      weight: player.weight,
      playingPosition: player.playingPosition,
      transferMarketLink: player.transferMarketLink,
      competitions: player.competitions,
      stateLeague: player.stateLeague,
      clubTier: player.clubTier,
      sprint30m: player.sprint30m,
      mentalityScore: player.mentalityScore,
    });

    await player.save();

    console.log(`✅ Updated ${player.name} with minimal data`);
    console.log(`New Score: ${player.scoutReport.totalScore} | Grade: ${player.scoutReport.grade || 'NO RATING'}`);
    console.log('\nMissing Data:');
    console.log('  - Height: ❌');
    console.log('  - Weight: ❌');
    console.log('  - Transfer Market Link: ❌');
    console.log('  - Competitions: ❌');
    console.log('  - State League: ❌');
    console.log('  - Club Tier: ❌');
    console.log('  - Sprint Times: ❌');
    console.log('  - Mentality Score: ❌');

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed:", error.message);
    process.exit(1);
  }
};

updatePlayer();
