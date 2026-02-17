// Seed dummy player data
// Run: node services/seedPlayers.js

require("dotenv").config();
const mongoose = require("mongoose");
const Player = require("../Models/Players");
const Admin = require("../Models/Admin");
const connectDB = require("../config/DB");

const samplePlayers = [
  {
    name: "Lionel Messi",
    age: 36,
    age_group: "Senior",
    playingPosition: "Forward",
    alternativePosition: "Attacking Midfielder",
    preferredFoot: "Left",
    transferMarketLink: "https://www.transfermarkt.com/lionel-messi/profil/spieler/28003",
    playerId: "LM10-2024",
    dateOfBirth: "1987-06-24",
    nationality: "Argentina",
    weight: 72,
    height: 170,
    gender: "Male",
    jersey_no: 10,
    size: "M",
    city: "Miami",
    address: "Inter Miami CF Stadium, Fort Lauderdale, FL",
    mobileNumber: "+1305123456",
    email: "lmessi@example.com",
    profileImage: [
      "https://example.com/images/messi-profile.jpg",
      "https://example.com/images/messi-dribble.jpg",
      "https://example.com/images/messi-celebration.jpg"
    ],
    scouting_notes: "Greatest playmaker of all time. Exceptional dribbling, vision, and finishing. 8 Ballon d'Or winner. World Cup champion 2022.",
    career_history: "Started at Newell's Old Boys youth system, joined Barcelona's La Masia academy (2000), first team debut (2004), Paris Saint-Germain (2021), Inter Miami (2023).",
    media_links: [
      "https://youtube.com/messi-highlights-2024",
      "https://example.com/messi-world-cup-journey.mp4",
      "https://example.com/messi-stats-report.pdf"
    ],
    clubsPlayed: [
      {
        clubName: "Barcelona",
        clubLogo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
        duration: "2004-2021"
      },
      {
        clubName: "Paris Saint-Germain",
        clubLogo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
        duration: "2021-2023"
      },
      {
        clubName: "Inter Miami",
        clubLogo: "https://upload.wikimedia.org/wikipedia/en/9/9b/Inter_Miami_CF_logo.svg",
        duration: "2023-Present"
      }
    ]
  },
  {
    name: "Kylian Mbappé",
    age: 25,
    age_group: "Senior",
    playingPosition: "Forward",
    alternativePosition: "Winger",
    preferredFoot: "Right",
    transferMarketLink: "https://www.transfermarkt.com/kylian-mbappe/profil/spieler/342229",
    playerId: "KM7-2024",
    dateOfBirth: "1998-12-20",
    nationality: "France",
    weight: 73,
    height: 178,
    gender: "Male",
    jersey_no: 7,
    size: "M",
    city: "Paris",
    address: "Parc des Princes, Paris, France",
    mobileNumber: "+33612345678",
    email: "kmbappe@example.com",
    profileImage: [
      "https://example.com/images/mbappe-profile.jpg",
      "https://example.com/images/mbappe-sprint.jpg"
    ],
    scouting_notes: "Lightning speed and clinical finishing. World Cup winner at 19. One of the fastest players in world football with exceptional movement off the ball.",
    career_history: "Monaco youth academy graduate, first team breakthrough (2015), PSG (2017-2024), Real Madrid (2024).",
    media_links: [
      "https://youtube.com/mbappe-speed-analysis",
      "https://example.com/mbappe-world-cup-goals.mp4"
    ],
    clubsPlayed: [
      {
        clubName: "AS Monaco",
        clubLogo: "https://upload.wikimedia.org/wikipedia/en/3/34/AS_Monaco_FC.svg",
        duration: "2015-2017"
      },
      {
        clubName: "Paris Saint-Germain",
        clubLogo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
        duration: "2017-2024"
      },
      {
        clubName: "Real Madrid",
        clubLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
        duration: "2024-Present"
      }
    ]
  },
  {
    name: "Emma Hayes",
    age: 17,
    age_group: "U17",
    playingPosition: "Midfielder",
    alternativePosition: "Defensive Midfielder",
    preferredFoot: "Right",
    transferMarketLink: "",
    playerId: "EH8-2024",
    dateOfBirth: "2007-03-15",
    nationality: "England",
    weight: 58,
    height: 165,
    gender: "Female",
    jersey_no: 8,
    size: "S",
    city: "London",
    address: "Youth Academy Training Grounds, London, UK",
    mobileNumber: "+442071234567",
    email: "ehayes@example.com",
    profileImage: [
      "https://example.com/images/emma-profile.jpg"
    ],
    scouting_notes: "Promising young talent with excellent passing range and tactical awareness. Strong work rate and leadership qualities. Captain of U17 national team.",
    career_history: "Chelsea FC Academy (2015-Present). England U15, U16, U17 international.",
    media_links: [
      "https://youtube.com/emma-youth-tournament-highlights"
    ],
    clubsPlayed: [
      {
        clubName: "Chelsea FC Women Academy",
        clubLogo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
        duration: "2015-Present"
      }
    ]
  },
  {
    name: "João Silva",
    age: 15,
    age_group: "U15",
    playingPosition: "Striker",
    alternativePosition: "Winger",
    preferredFoot: "Both",
    transferMarketLink: "",
    playerId: "JS9-2024",
    dateOfBirth: "2009-08-22",
    nationality: "Brazil",
    weight: 62,
    height: 172,
    gender: "Male",
    jersey_no: 9,
    size: "M",
    city: "São Paulo",
    address: "São Paulo FC Youth Academy, Brazil",
    mobileNumber: "+5511987654321",
    email: "jsilva@example.com",
    profileImage: [
      "https://example.com/images/joao-profile.jpg",
      "https://example.com/images/joao-training.jpg"
    ],
    scouting_notes: "Exciting prospect with natural goal-scoring instinct. Quick feet, good balance, and ability to use both feet effectively. Top scorer in U15 regional league.",
    career_history: "Started at local club Palmeiras youth system (2017-2022), moved to São Paulo FC Academy (2022-Present).",
    media_links: [
      "https://youtube.com/joao-goals-compilation",
      "https://example.com/joao-skills-assessment.pdf"
    ],
    clubsPlayed: [
      {
        clubName: "Palmeiras Youth",
        clubLogo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg",
        duration: "2017-2022"
      },
      {
        clubName: "São Paulo FC Academy",
        clubLogo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg",
        duration: "2022-Present"
      }
    ]
  }
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
