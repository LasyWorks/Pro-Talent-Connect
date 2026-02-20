/**
 * Scout Friendly Report™ — Scoring Calculator
 * Pro Talent Connect Plus (+)
 *
 * Official Grading & Evaluation Framework
 * Total Score: 100 Maximum | Grades: A–E
 */

// ─── 4.1 Age – Future Prospect Weightage (max 5) ───
function calcAgeScore(age) {
  if (!age || isNaN(age) || age < 16) return 0;
  age = parseInt(age);
  if (age <= 17) return 5;
  if (age <= 19) return 4;
  if (age <= 21) return 2;
  if (age <= 23) return 1;
  return 0; // 24+
}

// ─── 4.2 Physical Profile (max 5) ───
function calcPhysicalScore(height, weight, position) {
  let score = 0;

  // BMI sub-score (max 3)
  if (height && weight && !isNaN(height) && !isNaN(weight)) {
    const heightM = parseFloat(height) / 100;
    const bmi = parseFloat(weight) / (heightM * heightM);

    if (bmi >= 18.5 && bmi <= 24.9) {
      score += 3; // Healthy
    } else if ((bmi >= 17 && bmi < 18.5) || (bmi > 24.9 && bmi <= 27)) {
      score += 2; // Near healthy
    } else if (bmi > 0) {
      score += 1; // Unhealthy / red zone
    }
  }

  // Height sub-score (max 2)
  if (height && !isNaN(height)) {
    const heightVal = parseFloat(height);
    const pos = (position || "").toLowerCase();
    const isExempt =
      pos.includes("winger") ||
      pos.includes("midfielder") ||
      pos.includes("mid");

    if (heightVal >= 180) {
      score += 2;
    } else if (heightVal >= 170) {
      score += 1;
    } else {
      // Position-adjusted: wingers/midfielders below 170 get +1 instead of 0
      score += isExempt ? 1 : 0;
    }
  }

  return Math.min(score, 5); // Cap at 5
}

// ─── 4.3 Transfer Market Presence (7.5) ───
function calcTransferMarketScore(transferMarketLink) {
  return transferMarketLink && transferMarketLink.trim().length > 0 ? 7.5 : 0;
}

// ─── 4.4 Competition Weightage (max 50) ───
const COMPETITION_POINTS = {
  "National Team": 25,
  "I-League Senior": 20,
  "I-League 2": 18.5,
  "I-League 3": 18,
  "State Franchise League": 18.5,
  "Santosh Trophy": 15,
  "National Youth Championships": 10,
  "Foreign Exposure": 7.5,
  "Elite Youth I-League": 5,
  RFDL: 5,
  "State League": 3,
  "State Youth League": 2,
  "District League": 1.5,
  Other: 0,
};

function calcCompetitionScore(competitions) {
  if (
    !competitions ||
    !Array.isArray(competitions) ||
    competitions.length === 0
  )
    return 0;
  let total = 0;
  try {
    for (const comp of competitions) {
      if (comp && comp.type && COMPETITION_POINTS[comp.type]) {
        total += COMPETITION_POINTS[comp.type];
      }
    }
  } catch (e) {
    console.error("Error calculating competition score:", e);
    return 0;
  }
  return Math.min(total, 50); // Capped at 50
}

// ─── 4.5 Championship Bonus ───
function calcChampionshipBonus(competitions) {
  if (
    !competitions ||
    !Array.isArray(competitions) ||
    competitions.length === 0
  )
    return 0;
  let bonus = 0;
  try {
    for (const comp of competitions) {
      if (comp && comp.result) {
        if (comp.result === "Champion") bonus += 2;
        else if (comp.result === "Runner-up") bonus += 1;
        else if (comp.result === "Third") bonus += 0.5;
      }
    }
  } catch (e) {
    console.error("Error calculating championship bonus:", e);
  }
  return bonus;
}

// ─── 4.6 State League Recognition Bonus ───
const STATE_LEAGUE_POINTS = {
  "Calcutta Premier Division": 2,
  "Mizoram PL": 2,
  "BDFA Super Division": 2,
  "Goa Pro League": 2,
  "Kerala PL": 1.5,
  "Shillong PL": 1.5,
  "Assam PL": 1.5,
  INAL: 1,
  "Delhi PL": 0.5,
  "Mumbai Elite": 0.5,
};

function calcStateLeagueBonus(stateLeague) {
  if (!stateLeague || typeof stateLeague !== "string") return 0;
  return STATE_LEAGUE_POINTS[stateLeague] || 0;
}

// ─── 4.7 Club Reputation Bonus ───
const CLUB_TIER_POINTS = {
  "Tier 1": 3, // ISL clubs
  "Tier 2": 2, // I-League clubs
  "Tier 3": 1, // I-League 2 qualified
};

function calcClubReputationBonus(clubTier) {
  if (!clubTier || typeof clubTier !== "string") return 0;
  return CLUB_TIER_POINTS[clubTier] || 0;
}

// ─── 4.8 Speed Metrics (max 2) ───
function calcSpeedScore(sprint30m) {
  if (!sprint30m || isNaN(sprint30m)) return 0;
  const time = parseFloat(sprint30m);
  if (time < 4.1) return 2; // Elite
  if (time <= 4.4) return 1; // Above average
  return 0; // Below benchmark
}

// ─── 4.9 Mentality Assessment (max 2) ───
function calcMentalityScore(mentalityScore) {
  if (!mentalityScore || isNaN(mentalityScore)) return 0;
  const score = parseInt(mentalityScore);
  if (score === 2) return 2; // Strong
  if (score === 1) return 1; // Good
  return 0;
}

// ─── Grade from total score ───
function getGrade(total) {
  if (total >= 80) return "A"; // Elite
  if (total >= 70) return "B"; // Professional
  if (total >= 50) return "C"; // Semi-Professional
  if (total >= 35) return "D"; // Amateur
  return "E"; // Semi-Amateur
}

// ─── Master calculator ───
function calculateScoutReport(player) {
  try {
    if (!player || typeof player !== "object") {
      console.error("Invalid player object for scout report calculation");
      return {
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

    const ageScore = calcAgeScore(player.age);
    const physicalScore = calcPhysicalScore(
      player.height,
      player.weight,
      player.playingPosition,
    );
    const transferMarketScore = calcTransferMarketScore(
      player.transferMarketLink,
    );
    const competitionScore = calcCompetitionScore(player.competitions);
    const championshipBonus = calcChampionshipBonus(player.competitions);
    const stateLeagueBonus = calcStateLeagueBonus(player.stateLeague);
    const clubReputationBonus = calcClubReputationBonus(player.clubTier);
    const speedScore = calcSpeedScore(player.sprint30m);
    const mentalityAssessment = calcMentalityScore(player.mentalityScore);

    // Sum all scores
    let rawTotal =
      (ageScore || 0) +
      (physicalScore || 0) +
      (transferMarketScore || 0) +
      (competitionScore || 0) +
      (championshipBonus || 0) +
      (stateLeagueBonus || 0) +
      (clubReputationBonus || 0) +
      (speedScore || 0) +
      (mentalityAssessment || 0);

    // Ensure rawTotal is a valid number
    if (isNaN(rawTotal)) {
      rawTotal = 0;
    }

    // Max score is 100
    const totalScore = Math.min(
      Math.max(Math.round(rawTotal * 10) / 10, 0),
      100,
    );
    
    // Grade logic: if score is 0 or very low (< 5), mark as insufficient data
    let grade = "";
    if (totalScore === 0) {
      grade = "N/A";
    } else if (totalScore < 5) {
      grade = "INCOMPLETE";
    } else {
      grade = getGrade(totalScore);
    }

    return {
      ageScore: ageScore || 0,
      physicalScore: physicalScore || 0,
      transferMarketScore: transferMarketScore || 0,
      competitionScore: competitionScore || 0,
      championshipBonus: championshipBonus || 0,
      stateLeagueBonus: stateLeagueBonus || 0,
      clubReputationBonus: clubReputationBonus || 0,
      speedScore: speedScore || 0,
      mentalityAssessment: mentalityAssessment || 0,
      totalScore,
      grade,
    };
  } catch (err) {
    console.error("Error calculating scout report:", err);
    return {
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
      grade: "N/A",
    };
  }
}

module.exports = {
  calculateScoutReport,
  getGrade,
};
