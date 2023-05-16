/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
const _ = require("lodash");
const logger = require("@miraclesoft/logger");
const queries = require("../../utils/queries");
const Awards = require("../../models/awards.model");
const tiers = require("./tier.controller");

exports.data = (req, finalIds) => {
  return new Promise((resolve, reject) => {
    logger.info("Final Response Data");
    queries
      .findUsers(
        { userId: req.body.userId },
        { awards: 1, highestTier: 1, dateOfJoining: 1 }
      )
      .then((userAwards) => {
        if (finalIds.length == 0) {
          tiers
            .highest(
              req,
              userAwards[0].highestTier,
              userAwards[0].dateOfJoining
            )
            .then(() => {
              resolve({ data: [] });
            });
        } else {
          const awardUserData = userAwards[0].awards.filter((award) =>
            finalIds.includes(award.awardId)
          );

          Awards.find({ awardId: { $in: finalIds } }, { _id: 0, __v: 0 })
            .then((awardsData) => {
              for (const i in awardsData) {
                const aId = _.filter(awardUserData, {
                  awardId: awardsData[i].awardId,
                });
                // eslint-disable-next-line no-param-reassign
                awardsData[i] = Object.assign(aId[0]._doc, awardsData[i]._doc);
                // eslint-disable-next-line eqeqeq
                if (i == awardsData.length - 1) {
                  tiers
                    .highest(
                      req,
                      userAwards[0].highestTier,
                      userAwards[0].dateOfJoining
                    )
                    .then(() => {
                      resolve({
                        data: awardsData,
                      });
                    });
                }
              }
            })
            .catch((error) => reject(error));
        }
      });
  });
};
