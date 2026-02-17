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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Player", playerSchema);
