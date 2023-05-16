const mongoose = require("mongoose");

const { Schema } = mongoose;

const stepsSchema = new Schema({
  docId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  tier: {
    type: String,
  },
  TotalMonthsteps: {
    type: Number,
  },
  historic: [
    {
      hourlySteps: {
        type: Array,
      },
      totalStepCount: {
        type: Number,
        default: 0,
      },
      timestamp: {
        type: Number,
      },
      date: {
        type: String,
      },
      weekNumber: {
        type: Number,
      },
    },
  ],
  previousDays: {
    type: Array,
    default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  weekNumber: {
    type: Number,
  },
});

module.exports = mongoose.model("Step", stepsSchema);
