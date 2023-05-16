const Joi = require("joi");

// for inserting info into db
const userSchema = Joi.object({
  userID: Joi.string().required(),
});

const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  pass: Joi.string().required(),
});

const loginSchema = Joi.object({
  loginId: Joi.string().required(),
  password: Joi.string().required(),
  dateOfJoining: Joi.string().required(),
  deviceID: Joi.string().required(),
  logoutDevice: Joi.boolean(),
});

const userDetails = Joi.object({
  userId: Joi.string().required(),
  alias: Joi.string().required(),
  height: Joi.number().required(),
  weight: Joi.number().required(),
});

const stepsSchema = Joi.object({
  userId: Joi.string().required(),
  stepCount: Joi.number(),
  tier: Joi.string().required(),
  weekNumber: Joi.number(),
  date: Joi.string().required(),
  timestamp: Joi.number(),
});

const addPreviousDaysSchema = Joi.object({
  userId: Joi.string().required(),
  records: Joi.array().required(),
  weekNumber: Joi.number().required(),
});

const historySchema = Joi.object({
  userId: Joi.string().required(),
});

const leaderboardSchema = Joi.object({
  tier: Joi.string().required(),
});

const userRankSchema = Joi.object({
  tier: Joi.string().required(),
  id: Joi.string().required(),
});

const addAwardsSchema = Joi.object({
  awardId: Joi.string().required(),
  awardsSteps: Joi.number(),
  awardName: Joi.string().required(),
  awardIconUrl: Joi.string().required(),
  categoryType: Joi.number().required(),
  awardDesc: Joi.string(),
  isStreak: Joi.boolean().required(),
  totalDays: Joi.number().required(),
});

const getAwardsSchema = Joi.object({
  userId: Joi.string().required(),
});

const logoutSchema = Joi.object({
  userId: Joi.string().required(),
});

module.exports = {
  userSchema,
  registerSchema,
  loginSchema,
  logoutSchema,
  userDetails,
  stepsSchema,
  addPreviousDaysSchema,
  historySchema,
  leaderboardSchema,
  addAwardsSchema,
  getAwardsSchema,
  userRankSchema,
};
