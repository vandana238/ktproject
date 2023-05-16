/* eslint-disable no-console */
/* eslint-disable no-loop-func */
/* eslint-disable eqeqeq */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const _ = require("lodash");
const moment = require("moment");
const logger = require("@miraclesoft/logger");
const { tiers } = require("../../utils/awards");
const queries = require("../../utils/queries");

const tierUpgrade = (request, tierName) => {
  return new Promise((resolve, reject) => {
    queries
      .updateUsers(
        { userId: request.userId },
        {
          $set: {
            tier: tierName,
          },
        }
      )
      .then(() => {
        resolve({ data: "updated tier" });
      })
      .catch((error) => reject(error));
  });
};
// eslint-disable-next-line no-unused-vars
exports.category8 = (request, awards) => {
  logger.info("Category 8");
  console.log("USER RES FOR /api/steps cat8.controller", request);
  logger.info(request);
  const arrayofAwards = [];
  return new Promise((resolve, reject) => {
    const prefix = "CAT08_";
    for (const i in tiers) {
      if (tiers[i].tierName == request.tier) {
        const aId = _.filter(request.awardss, {
          awardId: `${prefix + tiers[i].tierName}Tier`,
        });
        if (aId.length === 0) {
          queries
            .updateUsers(
              { userId: request.userId },
              {
                $push: {
                  awards: {
                    awardId: `${prefix + tiers[i].tierName}Tier`,
                    progressDays: -1,
                    isAchieved: true,
                    date: request.date,
                    isStreak: true,
                    totalDays: 4,
                  },
                },
              }
            )
            .then(() => {
              let progressDay;
              if (request.todaysteps >= tiers[Number(i)].goal) {
                progressDay = 1;
              } else {
                progressDay = 0;
              }
              queries
                .updateUsers(
                  { userId: request.userId },
                  {
                    $push: {
                      awards: {
                        awardId: `${
                          prefix + tiers[Number(i) + 1].tierName
                        }Tier`,
                        progressDays: progressDay,
                        isAchieved: false,
                        startDate: request.date,
                        date: request.date,
                        isStreak: true,
                        totalDays: 4,
                      },
                    },
                  }
                )
                .then(() => {
                  arrayofAwards.push(
                    `${prefix + tiers[i].tierName}Tier`,
                    `${prefix + tiers[Number(i) + 1].tierName}Tier`
                  );
                  console.log(
                    "USER RES FOR /api/steps cat8.controller",
                    arrayofAwards
                  );
                  logger.info(arrayofAwards);
                  resolve({ tier: request.tier, data: arrayofAwards });
                })
                .catch((error) => reject(error));
            })
            .catch((error) => reject(error));
          break;
        } else if (aId.length !== 0 && Number(i) !== tiers.length - 1) {
          const nextAid = _.filter(request.awardss, {
            awardId: `${prefix + tiers[Number(i) + 1].tierName}Tier`,
          });
          if (
            request.todaysteps >= tiers[Number(i)].goal &&
            Math.abs(
              moment(nextAid[0].startDate, "YYYY/MM/DD")
                .startOf("day")
                .diff(moment(request.date, "YYYY/MM/DD").startOf("day"), "days")
            ) <= 7 &&
            nextAid[0].progressDays + 1 === 4 &&
            nextAid[0].date !== request.date &&
            Number(i) !== tiers.length - 1
          ) {
            queries
              .updateUsers(
                {
                  userId: request.userId,
                  "awards.awardId": `${
                    prefix + tiers[Number(i) + 1].tierName
                  }Tier`,
                },
                {
                  $set: {
                    "awards.$.date": request.date,
                    "awards.$.startDate": request.date,
                    "awards.$.isAchieved": true,
                    "awards.$.progressDays": 0,
                  },
                }
              )
              .then(() => {
                // added here
                let progressDay;
                if (request.todaysteps >= tiers[Number(i)].goal) {
                  progressDay = 1;
                } else {
                  progressDay = 0;
                }
                // upto here
                tierUpgrade(request, tiers[Number(i) + 1].tierName)
                  .then()
                  .catch();
                if (Number(i) < tiers.length - 2) {
                  queries
                    .updateUsers(
                      { userId: request.userId },
                      {
                        $push: {
                          awards: {
                            awardId: `${
                              prefix + tiers[Number(i) + 2].tierName
                            }Tier`,
                            progressDays: progressDay,
                            isAchieved: false,
                            startDate: request.date,
                            date: request.date,
                            isStreak: true,
                            totalDays: 4,
                          },
                        },
                      }
                    )
                    .then(() => {
                      arrayofAwards.push(
                        `${prefix + tiers[Number(i) + 1].tierName}Tier`,
                        `${prefix + tiers[Number(i) + 2].tierName}Tier`
                      );
                      console.log(
                        "USER RES FOR /api/steps cat8.controller",
                        arrayofAwards
                      );
                      logger.info(arrayofAwards);
                      resolve({
                        tier: tiers[Number(i) + 1].tierName,
                        data: arrayofAwards,
                      });
                    })
                    .catch((error) => reject(error));
                } else if (
                  Number(i) === tiers.length - 1 ||
                  Number(i) === tiers.length - 2
                ) {
                  arrayofAwards.push(
                    `${prefix + tiers[Number(i) + 1].tierName}Tier`
                  );
                  console.log(
                    "USER RES FOR /api/steps cat8.controller",
                    arrayofAwards
                  );
                  logger.info(arrayofAwards);
                  resolve({
                    tier: tiers[Number(i) + 1].tierName,
                    data: arrayofAwards,
                  });
                }
              })
              .catch((error) => reject(error));
            break;
          } else if (
            request.todaysteps < tiers[Number(i)].goal &&
            Math.abs(
              moment(nextAid[0].startDate, "YYYY/MM/DD")
                .startOf("day")
                .diff(moment(request.date, "YYYY/MM/DD").startOf("day"), "days")
            ) <= 7
          ) {
            console.log(
              "USER RES FOR /api/steps cat8.controller",
              arrayofAwards
            );
            logger.info(arrayofAwards);
            resolve({ tier: request.tier, data: arrayofAwards });
            break;
          } else if (
            request.todaysteps >= tiers[Number(i)].goal &&
            Math.abs(
              moment(nextAid[0].startDate, "YYYY/MM/DD")
                .startOf("day")
                .diff(moment(request.date, "YYYY/MM/DD").startOf("day"), "days")
            ) <= 7 &&
            nextAid[0].progressDays < 4 &&
            (nextAid[0].date !== request.date ||
              nextAid[0].progressDays == 0) &&
            Number(i) !== tiers.length - 1
          ) {
            queries
              .updateUsers(
                {
                  userId: request.userId,
                  "awards.awardId": `${
                    prefix + tiers[Number(i) + 1].tierName
                  }Tier`,
                },
                {
                  $inc: { "awards.$.progressDays": 1 },
                  $set: {
                    "awards.$.date": request.date,
                  },
                }
              )
              .then(() => {
                arrayofAwards.push(
                  `${prefix + tiers[Number(i) + 1].tierName}Tier`
                );
                console.log(
                  "USER RES FOR /api/steps cat8.controller",
                  arrayofAwards
                );
                logger.info(arrayofAwards);
                resolve({ tier: request.tier, data: arrayofAwards });
              })
              .catch((error) => reject(error));
            break;
          } else if (
            request.date == nextAid[0].date &&
            nextAid[0].progressDays > 0
          ) {
            console.log(
              "USER RES FOR /api/steps cat8.controller",
              arrayofAwards
            );
            logger.info(arrayofAwards);
            resolve({ tier: request.tier, data: arrayofAwards });
            break;
          } else if (
            Math.abs(
              moment(nextAid[0].startDate, "YYYY/MM/DD")
                .startOf("day")
                .diff(moment(request.date, "YYYY/MM/DD").startOf("day"), "days")
            ) > 7
          ) {
            if (Number(i) == 0) {
              queries
                .updateUsers(
                  {
                    userId: request.userId,
                    "awards.awardId": `${
                      prefix + tiers[Number(i) + 1].tierName
                    }Tier`,
                  },
                  {
                    $set: {
                      "awards.$.date": request.date,
                      "awards.$.progressDays": 0,
                      "awards.$.startDate": request.date,
                      "awards.$.isAchieved": false,
                    },
                  }
                )
                .then(() => {
                  arrayofAwards.push(
                    `${prefix + tiers[Number(i) + 1].tierName}Tier`
                  );
                  console.log(
                    "USER RES FOR /api/steps cat8.controller",
                    arrayofAwards
                  );
                  logger.info(arrayofAwards);
                  resolve({ tier: request.tier, data: arrayofAwards });
                })
                .catch((error) => reject(error));
            } else {
              queries
                .updateUsers(
                  { userId: request.userId },
                  {
                    $pull: {
                      awards: {
                        awardId: `${
                          prefix + tiers[Number(i) + 1].tierName
                        }Tier`,
                      },
                    },
                  }
                )
                .then(() => {
                  queries
                    .updateUsers(
                      {
                        userId: request.userId,
                        "awards.awardId": `${prefix + tiers[i].tierName}Tier`,
                      },
                      {
                        $set: {
                          "awards.$.date": request.date,
                          "awards.$.progressDays": 0,
                          "awards.$.startDate": request.date,
                          "awards.$.isAchieved": false,
                        },
                      }
                    )
                    .then(() => {
                      tierUpgrade(request, tiers[Number(i) - 1].tierName);
                      arrayofAwards.push(`${prefix + tiers[i].tierName}Tier`);
                      console.log(
                        "USER RES FOR /api/steps cat8.controller",
                        arrayofAwards
                      );
                      logger.info(arrayofAwards);
                      resolve({
                        tier: tiers[Number(i) - 1].tierName,
                        data: arrayofAwards,
                      });
                    })
                    .catch((error) => reject(error));
                })
                .catch((error) => reject(error));
            }
            break;
          }
        } else if (aId.length !== 0 && Number(i) == tiers.length - 1) {
          const nextAid = _.filter(request.awardss, {
            awardId: `${prefix + tiers[i].tierName}Tier`,
          });
          if (
            request.todaysteps >= tiers[i].goal &&
            Math.abs(
              moment(nextAid[0].startDate, "YYYY/MM/DD")
                .startOf("day")
                .diff(moment(request.date, "YYYY/MM/DD").startOf("day"), "days")
            ) <= 7 &&
            nextAid[0].progressDays + 1 === 4 &&
            nextAid[0].date !== request.date
          ) {
            queries
              .updateUsers(
                {
                  userId: request.userId,
                  "awards.awardId": `${prefix + tiers[i].tierName}Tier`,
                },
                {
                  $set: {
                    "awards.$.date": request.date,
                    "awards.$.startDate": request.startDate,
                    "awards.$.isAcheived": true,
                    "awards.$.progressDays": 0,
                  },
                }
              )
              .then(() => {
                arrayofAwards.push(`${prefix + tiers[i].tierName}Tier`);
                console.log(
                  "USER RES FOR /api/steps cat8.controller",
                  arrayofAwards
                );
                logger.info(arrayofAwards);
                resolve({ tier: request.tier, data: arrayofAwards });
              })
              .catch((error) => reject(error));
          } else if (
            request.todaysteps >= tiers[i].goal &&
            Math.abs(
              moment(nextAid[0].startDate, "YYYY/MM/DD")
                .startOf("day")
                .diff(moment(request.date, "YYYY/MM/DD").startOf("day"), "days")
            ) <= 7 &&
            nextAid[0].progressDays < 4 &&
            (nextAid[0].date !== request.date || nextAid[0].progressDays == 0)
          ) {
            queries
              .updateUsers(
                {
                  userId: request.userId,
                  "awards.awardId": `${prefix + tiers[i].tierName}Tier`,
                },
                {
                  $inc: { "awards.$.progressDays": 1 },
                  $set: {
                    "awards.$.date": request.date,
                  },
                }
              )
              .then(() => {
                arrayofAwards.push(`${prefix + tiers[i].tierName}Tier`);
                console.log(
                  "USER RES FOR /api/steps cat8.controller",
                  arrayofAwards
                );
                logger.info(arrayofAwards);
                resolve({ tier: request.tier, data: arrayofAwards });
              })
              .catch((error) => reject(error));
          } else if (
            request.todaysteps < tiers[i].goal &&
            Math.abs(
              moment(nextAid[0].startDate, "YYYY/MM/DD")
                .startOf("day")
                .diff(moment(request.date, "YYYY/MM/DD").startOf("day"), "days")
            ) <= 7
          ) {
            console.log(
              "USER RES FOR /api/steps cat8.controller",
              arrayofAwards
            );
            logger.info(arrayofAwards);
            resolve({ tier: request.tier, data: arrayofAwards });
          } else if (
            Math.abs(
              moment(nextAid[0].startDate, "YYYY/MM/DD")
                .startOf("day")
                .diff(moment(request.date, "YYYY/MM/DD").startOf("day"), "days")
            ) > 7
          ) {
            queries
              .updateUsers(
                { userId: request.userId },
                {
                  $pull: {
                    awards: {
                      awardId: `${prefix + tiers[i].tierName}Tier`,
                    },
                  },
                }
              )
              .then(() => {
                queries
                  .updateUsers(
                    {
                      userId: request.userId,
                      "awards.awardId": `${
                        prefix + tiers[Number(i) - 1].tierName
                      }Tier`,
                    },
                    {
                      $set: {
                        "awards.$.date": request.date,
                        "awards.$.progressDays": 0,
                        "awards.$.startDate": request.date,
                        "awards.$.isAchieved": false,
                      },
                    }
                  )
                  .then(() => {
                    tierUpgrade(request, tiers[Number(i) - 2].tierName);
                    arrayofAwards.push(
                      `${prefix + tiers[Number(i) - 1].tierName}Tier`
                    );
                    console.log(
                      "USER RES FOR /api/steps cat8.controller",
                      arrayofAwards
                    );
                    logger.info(arrayofAwards);
                    resolve({
                      tier: tiers[Number(i) - 2].tierName,
                      data: arrayofAwards,
                    });
                  })
                  .catch((error) => reject(error));
              })
              .catch((error) => reject(error));
          } else if (
            request.date == nextAid[0].date &&
            nextAid[0].progressDays > 0
          ) {
            console.log(
              "USER RES FOR /api/steps cat8.controller",
              arrayofAwards
            );
            logger.info(arrayofAwards);
            resolve({ tier: request.tier, data: arrayofAwards });
          }
        }
      }
    }
  });
};
