const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    clubsPlayed: [
      {
        clubName: String,
        duration: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Player", playerSchema);
