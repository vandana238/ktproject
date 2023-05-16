/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const logger = require("@miraclesoft/logger");
const moment = require("moment");
const _ = require("lodash");
const queries = require("../../utils/queries");
const { tiers } = require("../../utils/awards");

exports.category2 = (request, awards) => {
  logger.info("Category 2");
  console.log("USER REQ FOR /api/steps cat2.controller", request);
  logger.info(request);
  return new Promise((resolve, reject) => {
    const arrayofAwards = [];
    for (const i in awards) {
      if (awards[i].category === 2) {
        // eslint-disable-next-line guard-for-in
        for (const j in awards[i].awardDescriptionRange) {
          queries
            .findSteps({
              docId: request.docId,
              "historic.date": moment(
                moment().subtract(0, "days").valueOf()
              ).format("YYYY/MM/DD"),
            })
            .then((yesterdayData) => {
              queries
                .findUsers({
                  userId: request.userId,
                  "awards.date": request.date,
                })
                .then((todayData) => {
                  if (yesterdayData.length === 0 && todayData.length === 0) {
                    queries
                      .updateUsers(
                        { userId: request.userId },
                        { $pull: { awards: { progressDays: { $ne: -1 } } } }
                      )
                      .then(() => {
                        const goalValue = _.filter(tiers, {
                          tierName: request.tier,
                        });
                        if (request.todaysteps >= goalValue[0].goal) {
                          queries
                            .updateUsers(
                              { userId: request.userId },
                              {
                                $push: {
                                  awards: {
                                    awardId: awards[i].awardId[j],
                                    progressDays: 1,
                                    date: request.date,
                                    isAchieved: false,
                                  },
                                },
                              }
                            )
                            .then(() => {
                              arrayofAwards.push(awards[i].awardId[j]);
                              if (
                                j ==
                                awards[i].awardDescriptionRange.length - 1
                              ) {
                                console.log(
                                  "USER RES FOR /api/steps cat2.controller",
                                  arrayofAwards
                                );
                                logger.info(arrayofAwards);
                                resolve({
                                  data: arrayofAwards,
                                });
                              }
                            });
                        } else if (request.todaysteps < goalValue[0].goal) {
                          if (j == awards[i].awardDescriptionRange.length - 1) {
                            console.log(
                              "USER RES FOR /api/steps cat2.controller",
                              arrayofAwards
                            );
                            logger.info(arrayofAwards);
                            resolve({
                              data: arrayofAwards,
                            });
                          }
                        }
                      });
                  } else {
                    const aId = _.filter(request.awardss, {
                      awardId: awards[i].awardId[j],
                    });
                    const goalValue = _.filter(tiers, {
                      tierName: request.tier,
                    });
                    if (aId.length === 0) {
                      if (request.todaysteps >= goalValue[0].goal) {
                        queries
                          .updateUsers(
                            { userId: request.userId },
                            {
                              $push: {
                                awards: {
                                  awardId: awards[i].awardId[j],
                                  progressDays: 1,
                                  date: request.date,
                                  isAchieved: false,
                                },
                              },
                            }
                          )
                          .then(() => {
                            arrayofAwards.push(awards[i].awardId[j]);
                            if (
                              j ==
                              awards[i].awardDescriptionRange.length - 1
                            ) {
                              console.log(
                                "USER RES FOR /api/steps cat2.controller",
                                arrayofAwards
                              );
                              logger.info(arrayofAwards);
                              resolve({
                                data: arrayofAwards,
                              });
                            }
                          });
                      } else if (request.todaysteps < goalValue[0].goal) {
                        if (j == awards[i].awardDescriptionRange.length - 1) {
                          console.log(
                            "USER RES FOR /api/steps cat2.controller",
                            arrayofAwards
                          );
                          logger.info(arrayofAwards);
                          resolve({
                            data: arrayofAwards,
                          });
                        }
                      }
                    } else if (
                      aId.length !== 0 &&
                      aId[0].progressDays <
                        awards[i].awardDescriptionRange[j].totlen &&
                      aId[0].date !== request.date
                    ) {
                      if (
                        request.todaysteps >= goalValue[0].goal &&
                        Math.abs(
                          moment(request.date, "YYYY/MM/DD")
                            .startOf("day")
                            .diff(
                              moment(aId[0].date, "YYYY/MM/DD").startOf("day"),
                              "days"
                            )
                        ) > 1
                      ) {
                        queries
                          .updateUsers(
                            { userId: request.userId },
                            {
                              $pull: {
                                awards: { awardId: awards[i].awardId[j] },
                              },
                            }
                          )
                          .then(() => {
                            queries
                              .updateUsers(
                                { userId: request.userId },
                                {
                                  $push: {
                                    awards: {
                                      awardId: awards[i].awardId[j],
                                      progressDays: 1,
                                      date: request.date,
                                      isAchieved: false,
                                    },
                                  },
                                }
                              )
                              .then(() => {
                                arrayofAwards.push(awards[i].awardId[j]);
                                if (
                                  j ==
                                  awards[i].awardDescriptionRange.length - 1
                                ) {
                                  console.log(
                                    "USER RES FOR /api/steps cat2.controller",
                                    arrayofAwards
                                  );
                                  logger.info(arrayofAwards);
                                  resolve({
                                    data: arrayofAwards,
                                  });
                                }
                              });
                          });
                      } else if (
                        request.todaysteps < goalValue[0].goal &&
                        Math.abs(
                          moment(request.date, "YYYY/MM/DD")
                            .startOf("day")
                            .diff(
                              moment(aId[0].date, "YYYY/MM/DD").startOf("day"),
                              "days"
                            )
                        ) > 1
                      ) {
                        queries
                          .updateUsers(
                            { userId: request.userId },
                            {
                              $pull: {
                                awards: { awardId: awards[i].awardId[j] },
                              },
                            }
                          )
                          .then(() => {
                            if (
                              j ==
                              awards[i].awardDescriptionRange.length - 1
                            ) {
                              console.log(
                                "USER RES FOR /api/steps cat2.controller",
                                arrayofAwards
                              );
                              logger.info(arrayofAwards);
                              resolve({
                                data: arrayofAwards,
                              });
                            }
                          });
                      } else if (
                        request.todaysteps >= goalValue[0].goal &&
                        Math.abs(
                          moment(request.date, "YYYY/MM/DD")
                            .startOf("day")
                            .diff(
                              moment(aId[0].date, "YYYY/MM/DD").startOf("day"),
                              "days"
                            )
                        ) === 1
                      ) {
                        let matchQuery = {};
                        let matchOperation = {};
                        if (
                          aId[0].progressDays + 1 ===
                          awards[i].awardDescriptionRange[j].totlen
                        ) {
                          matchQuery = {
                            userId: request.userId,
                            "awards.awardId": aId[0].awardId,
                          };

                          matchOperation = {
                            $inc: { "awards.$.progressDays": 1 },
                            $set: {
                              "awards.$.date": request.date,
                              "awards.$.isAchieved": true,
                            },
                          };
                        } else {
                          matchQuery = {
                            userId: request.userId,
                            "awards.awardId": aId[0].awardId,
                          };

                          matchOperation = {
                            $inc: { "awards.$.progressDays": 1 },
                            $set: {
                              "awards.$.date": request.date,
                              "awards.$.isAchieved": false,
                            },
                          };
                        }

                        queries
                          .updateUsers(matchQuery, matchOperation)
                          .then(() => {
                            arrayofAwards.push(awards[i].awardId[j]);
                            if (
                              j ==
                              awards[i].awardDescriptionRange.length - 1
                            ) {
                              console.log(
                                "USER RES FOR /api/steps cat2.controller",
                                arrayofAwards
                              );
                              logger.info(arrayofAwards);
                              resolve({
                                data: arrayofAwards,
                              });
                            }
                          });
                      } else if (
                        request.todaysteps < goalValue[0].goal &&
                        Math.abs(
                          moment(request.date, "YYYY/MM/DD")
                            .startOf("day")
                            .diff(
                              moment(aId[0].date, "YYYY/MM/DD").startOf("day"),
                              "days"
                            )
                        ) === 1
                      ) {
                        if (j == awards[i].awardDescriptionRange.length - 1) {
                          console.log(
                            "USER RES FOR /api/steps cat2.controller",
                            arrayofAwards
                          );
                          logger.info(arrayofAwards);
                          resolve({
                            data: arrayofAwards,
                          });
                        }
                      }
                    } else if (
                      aId.length !== 0 &&
                      aId[0].progressDays <
                        awards[i].awardDescriptionRange[j].totlen &&
                      aId[0].date === request.date
                    ) {
                      if (j == awards[i].awardDescriptionRange.length - 1) {
                        console.log(
                          "USER RES FOR /api/steps cat2.controller",
                          arrayofAwards
                        );
                        logger.info(arrayofAwards);
                        resolve({
                          data: arrayofAwards,
                        });
                      }
                    }
                  }
                });
            })
            .catch((error) => {
              reject(error);
            });
        }
      }
    }
  });
};
