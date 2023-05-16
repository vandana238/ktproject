/* eslint-disable no-console */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint no-promise-executor-return: "error" */
const logger = require("@miraclesoft/logger");
const _ = require("lodash");
const queries = require("../../utils/queries");
const awardModel = require("../../models/awards.model");

exports.category5 = async (request) => {
  logger.info("Category 5");
  console.log("USER REQ FOR /api/steps cat5.controller", request);
  logger.info(request);
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const arrayofAwards = [];
    const awardResult = await awardModel
      .find({ awardId: { $regex: /CAT05_/ } }, { _id: 0, __v: 0 })
      .sort({ awardsSteps: 1 })
      .lean();
    const awards = {
      awardId: [],
      awardName: [],
      awardDescriptionRange: [],
      category: 5,
    };
    for (const i in awardResult) {
      awards.awardId.push(awardResult[i].awardId);
      awards.awardName.push(awardResult[i].awardName);
      awards.awardDescriptionRange.push(awardResult[i].awardsSteps);
      if (Number(i) === awardResult.length - 1) {
        for (const j in awards.awardDescriptionRange) {
          const aId = _.filter(request.awardss, {
            awardId: awards.awardId[j],
          });
          if (request.lifeSteps < awards.awardDescriptionRange[j]) {
            if (
              aId.length !== 0 &&
              _.some(request.awardss, {
                awardId: awards.awardId[j],
                isAchieved: false,
              })
            ) {
              queries
                .updateUsers(
                  {
                    userId: request.userId,
                    "awards.awardId": awards.awardId[j],
                  },
                  {
                    $set: {
                      "awards.$.progressSteps": request.lifeSteps,
                      "awards.$.isAchieved": false,
                      "awards.$.date": request.date,
                    },
                  }
                )
                .then(() => {
                  console.log(
                    "USER RES FOR /api/steps cat5.controller",
                    arrayofAwards
                  );
                  logger.info(arrayofAwards);
                  resolve({ data: arrayofAwards });
                })
                .catch((error) => reject(error));
              break;
            } else if (aId.length === 0) {
              queries
                .updateUsers(
                  { userId: request.userId },
                  {
                    $push: {
                      awards: {
                        awardId: awards.awardId[j],
                        progressDays: -1,
                        isAchieved: false,
                        progressSteps: request.lifeSteps,
                        date: request.date,
                      },
                    },
                  }
                )
                .then(() => {
                  arrayofAwards.push(awards.awardId[j]);
                  console.log(
                    "USER RES FOR /api/steps cat5.controller",
                    arrayofAwards
                  );
                  logger.info(arrayofAwards);
                  resolve({ data: arrayofAwards });
                })
                .catch((error) => reject(error));
              break;
            } else if (
              aId.length !== 0 &&
              _.some(request.awardss, {
                awardId: awards.awardId[j],
                isAchieved: true,
              })
            ) {
              if (j === awards.awardDescriptionRange.length - 1) {
                console.log(
                  "USER RES FOR /api/steps cat5.controller",
                  arrayofAwards
                );
                logger.info(arrayofAwards);
                resolve({
                  data: arrayofAwards,
                });
              } else {
                continue;
              }
            }
          } else if (request.lifeSteps >= awards.awardDescriptionRange[j]) {
            if (
              aId.length !== 0 &&
              _.some(request.awardss, {
                awardId: awards.awardId[j],
                isAchieved: false,
              })
            ) {
              queries
                .updateUsers(
                  {
                    userId: request.userId,
                    "awards.awardId": awards.awardId[j],
                  },
                  {
                    $set: {
                      "awards.$.progressSteps": awards.awardDescriptionRange[j],
                      "awards.$.isAchieved": true,
                      "awards.$.date": request.date,
                    },
                  }
                )
                .then(() => {
                  arrayofAwards.push(awards.awardId[j]);
                  if (j === awards.awardDescriptionRange.length - 1) {
                    console.log(
                      "USER RES FOR /api/steps cat5.controller",
                      arrayofAwards
                    );
                    logger.info(arrayofAwards);
                    resolve({ data: arrayofAwards });
                  }
                })
                .catch((error) => reject(error));
            } else if (aId.length === 0) {
              queries
                .updateUsers(
                  { userId: request.userId },
                  {
                    $push: {
                      awards: {
                        awardId: awards.awardId[j],
                        progressDays: -1,
                        isAchieved: true,
                        progressSteps: awards.awardDescriptionRange[j],
                        date: request.date,
                      },
                    },
                  }
                )
                .then(() => {
                  arrayofAwards.push(awards.awardId[j]);
                  if (j === awards.awardDescriptionRange.length - 1) {
                    console.log(
                      "USER RES FOR /api/steps cat5.controller",
                      arrayofAwards
                    );
                    logger.info(arrayofAwards);
                    resolve({ data: arrayofAwards });
                  }
                })
                .catch((error) => reject(error));
            } else if (
              aId.length !== 0 &&
              _.some(request.awardss, {
                awardId: awards.awardId[j],
                isAchieved: true,
              })
            ) {
              if (Number(j) === awards.awardDescriptionRange.length - 1) {
                console.log(
                  "USER RES FOR /api/steps cat5.controller",
                  arrayofAwards
                );
                logger.info(arrayofAwards);
                resolve({
                  data: arrayofAwards,
                });
              } else {
                continue;
              }
            }
          }
        }
        // }
        // }
      }
    }
  });
};
