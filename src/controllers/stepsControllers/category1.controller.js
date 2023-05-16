/* eslint-disable no-console */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const logger = require("@miraclesoft/logger");
const _ = require("lodash");
const queries = require("../../utils/queries");

exports.category1 = (request, awards) => {
  logger.info("Category 1");
  console.log("USER REQ FOR /api/steps cat1.controller", request);
  logger.info(request);
  return new Promise((resolve, reject) => {
    const arrayofAwards = [];
    for (const i in awards) {
      if (awards[i].category === 1) {
        for (const j in awards[i].awardDescriptionRange) {
          const aId = _.filter(request.awardss, {
            awardId: awards[i].awardId[j],
          });
          if (request.totalStepCount < awards[i].awardDescriptionRange[j]) {
            if (
              aId.length !== 0 &&
              _.some(request.awardss, {
                awardId: awards[i].awardId[j],
                isAchieved: false,
              })
            ) {
              queries
                .updateUsers(
                  {
                    userId: request.userId,
                    "awards.awardId": awards[i].awardId[j],
                  },
                  {
                    $set: {
                      "awards.$.progressSteps": request.totalStepCount,
                      "awards.$.isAchieved": false,
                      "awards.$.date": request.date,
                    },
                  }
                )
                .then(() => {
                  console.log(
                    "USER RES FOR /api/steps cat1.controller",
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
                        awardId: awards[i].awardId[j],
                        progressDays: -1,
                        isAchieved: false,
                        progressSteps: request.totalStepCount,
                        date: request.date,
                      },
                    },
                  }
                )
                .then(() => {
                  arrayofAwards.push(awards[i].awardId[j]);
                  console.log(
                    "USER RES FOR /api/steps cat1.controller",
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
                awardId: awards[i].awardId[j],
                isAchieved: true,
              })
            ) {
              if (Number(j) === awards[i].awardDescriptionRange.length - 1) {
                console.log(
                  "USER RES FOR /api/steps cat1.controller",
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
          } else if (
            request.totalStepCount >= awards[i].awardDescriptionRange[j]
          ) {
            if (
              aId.length !== 0 &&
              _.some(request.awardss, {
                awardId: awards[i].awardId[j],
                isAchieved: false,
              })
            ) {
              queries
                .updateUsers(
                  {
                    userId: request.userId,
                    "awards.awardId": awards[i].awardId[j],
                  },
                  {
                    $set: {
                      "awards.$.progressSteps":
                        awards[i].awardDescriptionRange[j],
                      "awards.$.isAchieved": true,
                      "awards.$.date": request.date,
                    },
                  }
                )
                .then(() => {
                  arrayofAwards.push(awards[i].awardId[j]);
                  if (
                    Number(j) ===
                    awards[i].awardDescriptionRange.length - 1
                  ) {
                    console.log(
                      "USER RES FOR /api/steps cat1.controller",
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
                        awardId: awards[i].awardId[j],
                        progressDays: -1,
                        isAchieved: true,
                        progressSteps: awards[i].awardDescriptionRange[j],
                        date: request.date,
                      },
                    },
                  }
                )
                .then(() => {
                  arrayofAwards.push(awards[i].awardId[j]);
                  if (
                    Number(j) ===
                    awards[i].awardDescriptionRange.length - 1
                  ) {
                    console.log(
                      "USER RES FOR /api/steps cat1.controller",
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
                awardId: awards[i].awardId[j],
                isAchieved: true,
              })
            ) {
              if (Number(j) === awards[i].awardDescriptionRange.length - 1) {
                console.log(
                  "USER RES FOR /api/steps cat1.controller",
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
      }
    }
  });
};
