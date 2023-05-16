/* eslint-disable no-console */
/* eslint-disable no-extend-native */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersSchema = new Schema({
  userId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  lifetimeSteps: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
    default: " ",
  },
  profilePicture: {
    type: String,
    default: null,
  },
  isLoggedin: {
    type: Boolean,
    required: true,
  },
  // refreshToken: {
  //   type: String,
  //   required: true,
  // },
  tier: {
    type: String,
    default: null,
  },
  highestTier: {
    type: String,
    default: "Bronze",
  },
  awards: [
    {
      awardId: String,
      progressDays: Number,
      isAchieved: Boolean,
      progressSteps: Number,
      date: String,
      startDate: String,
    },
  ],
  height: {
    type: Number,
    default: -1,
  },
  weight: {
    type: Number,
    default: -1,
  },
  dateOfJoining: {
    type: String,
    default: null,
  },
  lastSevenEntries: {
    weekArray: [Object],
    totalWeekSteps: {
      type: Number,
      default: 0,
    },
  },
  deviceID: {
    type: String,
    required: true,
  },
  blacklistedId: {
    type: Array,
    default: null,
  },
});

module.exports = mongoose.model("User", usersSchema);
