const express = require("express");

const router = express.Router();
const schema = require("../schemas/apiRequest.schema");
const joiValidator = require("../schemas/validation.schema");

const registerController = require("../controllers/mHealthControllers/register.controller");
const previousDayStepsController = require("../controllers/mHealthControllers/previousDaySteps.controller");
const getHistoricStepsController = require("../controllers/mHealthControllers/getHistoricSteps.controller");
const leaderboardController = require("../controllers/mHealthControllers/leaderboard.controller");
const insertAwardController = require("../controllers/mHealthControllers/insertAwards.controller");
const findAwardController = require("../controllers/mHealthControllers/findAwards.controller");
const addStepsController = require("../controllers/stepsControllers/addSteps.controller");
const userController = require("../controllers/mHealthControllers/user.controller");

// eslint-disable-next-line no-unused-vars
router.post(
  "/steps",
  joiValidator.postData(schema.stepsSchema),
  registerController.register
);

router.put(
  "/steps",
  joiValidator.postData(schema.stepsSchema),
  addStepsController.addSteps
);

router.put(
  "/previousDays",
  joiValidator.postData(schema.addPreviousDaysSchema),
  previousDayStepsController.add
);

router.get(
  "/history/:userId",
  joiValidator.getData(schema.historySchema),
  getHistoricStepsController.getHistoricSteps
);

router.get(
  "/leaderboard/:tier",
  joiValidator.getData(schema.leaderboardSchema),
  leaderboardController.leaderboard
);

router.get(
  "/rank/:tier/:id",
  joiValidator.getData(schema.userRankSchema),
  userController.rank
);

router.post(
  "/awards",
  joiValidator.postData(schema.addAwardsSchema),
  insertAwardController.insert
);

router.get(
  "/awards/:userId",
  joiValidator.getData(schema.getAwardsSchema),
  findAwardController.find
);

module.exports = router;
