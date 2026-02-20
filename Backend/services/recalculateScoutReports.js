// Recalculate scout reports for all players
// Run: node services/recalculateScoutReports.js

require("dotenv").config();
const mongoose = require("mongoose");
const Player = require("../Models/Players");
const { calculateScoutReport } = require("../services/scoutReportCalculator");
const connectDB = require("../config/DB");

const recalculateScoutReports = async () => {
  try {
    await connectDB();
    console.log("🔄 Recalculating scout reports for all players...\n");

    const players = await Player.find({ isDeleted: false });
    console.log(`Found ${players.length} players to process.\n`);

    let updated = 0;
    let failed = 0;

    for (const player of players) {
      try {
        // Calculate scout report
        const scoutReport = calculateScoutReport({
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

        // Update player
        player.scoutReport = scoutReport;
        await player.save();

        console.log(`✅ ${player.name} (${player.playerId}) - Total Score: ${scoutReport.totalScore} | Grade: ${scoutReport.grade}`);
        updated++;
      } catch (error) {
        console.error(`❌ Failed for ${player.name}: ${error.message}`);
        failed++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - Updated: ${updated} players`);
    console.log(`   - Failed: ${failed} players`);
    console.log(`   - Total: ${players.length} players`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
  }
};

recalculateScoutReports();
