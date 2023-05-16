/* eslint-disable no-console */
const logger = require("@miraclesoft/logger");
const _ = require("lodash");
const { tiers } = require("../../utils/awards");
const queries = require("../../utils/queries");

exports.highest = (req, highestTier, dateOfJoining) => {
  console.log(
    "USER REQ FOR /api/steps tier.controller",
    req.body,
    highestTier,
    dateOfJoining
  );
  logger.info(req.body);
  logger.info(highestTier);
  return new Promise((resolve) => {
    const index = _.findIndex(tiers, (tier) => {
      return tier.tierName === req.body.tier;
    });
    const index2 = _.findIndex(tiers, (tier) => {
      return tier.tierName === highestTier;
    });
    if (index2 < index) {
      queries
        .updateUsers(
          { userId: req.body.userId },
          { $set: { highestTier: req.body.tier } }
        )
        .then(() => {
          console.log(
            "USER RES FOR /api/steps tier.controller",
            req.body.tier,
            dateOfJoining
          );
          logger.info(req.body.tier);
          resolve({
            highestTier: req.body.tier,
            dateOfJoining,
          });
        });
    } else {
      console.log(
        "USER RES FOR /api/steps tier.controller",
        highestTier,
        dateOfJoining
      );
      logger.info(highestTier);
      resolve({
        highestTier,
        dateOfJoining,
      });
    }
  });
};
