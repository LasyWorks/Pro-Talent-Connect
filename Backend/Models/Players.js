const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 5,
      max: 100,
    },
    age_group: {
      type: String,
      enum: ["U13", "U15", "U17", "U19", "Senior"],
    },
    playingPosition: {
      type: String,
      required: true,
    },
    alternativePosition: {
      type: String,
    },
    preferredFoot: {
      type: String,
      enum: ["Left", "Right", "Both"],
    },
    transferMarketLink: {
      type: String,
      trim: true,
    },
    playerId: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    nationality: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number, // in kg
    },
    height: {
      type: Number, // in cm
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    jersey_no: {
      type: Number,
      min: 0,
      max: 99,
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    scouting_notes: {
      type: String,
      default: "",
    },
    career_history: {
      type: String,
      default: "",
    },
    media_links: {
      type: [String],
      default: [],
    },

    // ─── Scout Friendly Report™ Fields ───
    // CRS / PL ID for AIFF verification
    plId: {
      type: String,
      trim: true,
      default: "",
    },

    // Competition history entries
    competitions: [
      {
        name: { type: String, required: true },
        type: {
          type: String,
          enum: [
            "National Team",
            "Santosh Trophy",
            "I-League Senior",
            "I-League 2",
            "I-League 3",
            "State Franchise League",
            "Elite Youth I-League",
            "National Youth Championships",
            "Foreign Exposure",
            "RFDL",
            "State League",
            "State Youth League",
            "District League",
            "Other",
          ],
        },
        year: { type: Number },
        result: {
          type: String,
          enum: ["Champion", "Runner-up", "Third", "Participant", ""],
          default: "",
        },
      },
    ],

    // State league recognition
    stateLeague: {
      type: String,
      enum: [
        "",
        "Calcutta Premier Division",
        "Mizoram PL",
        "BDFA Super Division",
        "Goa Pro League",
        "Kerala PL",
        "Shillong PL",
        "Assam PL",
        "INAL",
        "Delhi PL",
        "Mumbai Elite",
      ],
      default: "",
    },

    // Club tier for reputation bonus
    clubTier: {
      type: String,
      enum: ["", "Tier 1", "Tier 2", "Tier 3"],
      default: "",
    },

    // Speed metrics
    sprint30m: {
      type: Number, // seconds
      min: 0,
    },
    sprint50m: {
      type: Number, // seconds
      min: 0,
    },

    // Mentality assessment score (1 or 2)
    mentalityScore: {
      type: Number,
      enum: [1, 2],
    },

    // Computed Scout Friendly Report™ scores (auto-calculated)
    scoutReport: {
      ageScore: { type: Number, default: 0 },
      physicalScore: { type: Number, default: 0 },
      transferMarketScore: { type: Number, default: 0 },
      competitionScore: { type: Number, default: 0 },
      championshipBonus: { type: Number, default: 0 },
      stateLeagueBonus: { type: Number, default: 0 },
      clubReputationBonus: { type: Number, default: 0 },
      speedScore: { type: Number, default: 0 },
      mentalityAssessment: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0, max: 100 },
      grade: {
        type: String,
        enum: ["A", "B", "C", "D", "E", ""],
        default: "",
      },
    },
    clubsPlayed: [
      {
        clubName: {
          type: String,
          required: true,
        },
        clubLogo: {
          type: String,
          default: "",
        },
        duration: {
          type: String,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Player", playerSchema);
