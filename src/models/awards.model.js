const mongoose = require("mongoose");

const { Schema } = mongoose;

const awardsSchema = new Schema({
  awardDesc: {
    type: String,
    required: true,
  },
  awardsSteps: {
    type: Number,
    required: true,
  },
  awardName: {
    type: String,
    required: true,
    unique: true,
  },
  awardIconUrl: {
    type: String,
    required: true,
  },
  awardId: {
    type: String,
    required: true,
  },
  categoryType: {
    type: Number,
    required: true,
  },
  isStreak: {
    type: Boolean,
    required: true,
  },
  totalDays: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Award", awardsSchema);
