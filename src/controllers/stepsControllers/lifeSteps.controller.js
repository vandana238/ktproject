/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const logger = require("@miraclesoft/logger");
const _ = require("lodash");
const queries = require("../../utils/queries");
const userFlow = require("./userUpdate.controller");

const stepsDocExists = (result, req, docId) => {
  return new Promise((resolve, reject) => {
    for (const i in result) {
      const checkDate = _.find(result[i].historic, ["date", req.body.date]);
      if (!_.isObject(checkDate)) {
        queries
          .updateOneSteps(
            { docId },
            {
              $push: {
                historic: {
                  date: req.body.date,
                  hourlySteps: [req.body.stepCount],
                  totalStepCount: req.body.stepCount,
                  timestamp: req.body.timestamp,
                  tier: req.body.tier,
                  weekNumber: req.body.weekNumber,
                },
              },
            }
          )
          .then(() => {
            userFlow.userFlow(req).then((data) => {
              resolve(data);
            });
          })
          .catch((error) => reject(error));

        break;
      } else {
        for (const j in result[i].historic) {
          if (result[i].historic[j].date === req.body.date) {
            queries
              .updateSteps(
                {
                  docId,
                  "historic.date": req.body.date,
                },
                {
                  $set: {
                    "historic.$.totalStepCount": req.body.stepCount,
                    tier: req.body.tier,
                  },
                  $push: {
                    "historic.$.hourlySteps": {
                      $each: [req.body.stepCount],
                    },
                  },
                }
              )
              .then(() => {
                userFlow.userFlow(req).then((data) => {
                  resolve(data);
                });
              })
              .catch((error) => reject(error));

            break;
          }
        }
      }
    }
  });
};

exports.update = (request) => {
  logger.info("Update User Steps");
  return new Promise((resolve, reject) => {
    const queryCondition = { userId: request.userId };

    const queryMatch = { userId: request.userId };
    const showFields = { "lastSevenEntries.weekArray": { $slice: -1 } };
    queries
      .findUsers(queryMatch, showFields)
      .then((userData) => {
        if (
          userData[0].lastSevenEntries.weekArray.length == 0 ||
          userData[0].lastSevenEntries.weekArray[0].date !== request.date
        ) {
          const queryOperation = {
            $set: {
              lifetimeSteps: userData[0].lifetimeSteps + request.stepCount,
            },
          };
          queries
            .updateOneUsers(queryCondition, queryOperation)
            .then((result) => {
              if (result) {
                resolve(result);
              } else {
                reject(new Error("Update Failed"));
              }
            })
            .catch((error) => reject(error));
        } else {
          const queryOperation = {
            $set: {
              lifetimeSteps:
                userData[0].lifetimeSteps +
                (request.stepCount -
                  userData[0].lastSevenEntries.weekArray[0].totalSteps),
            },
          };
          queries
            .updateOneUsers(queryCondition, queryOperation)
            .then((result) => {
              if (result) {
                resolve(result);
              } else {
                reject(new Error("Update Failed"));
              }
            })
            .catch((error) => reject(error));
        }
      })
      .catch((error) => reject(error));
  });
};
exports.noDocExists = (docId, req) => {
  return new Promise((resolve, reject) => {
    const queryMatch = { docId };
    const showFields = {};
    queries
      .findSteps(queryMatch, showFields)
      .then((stepsResult) => {
        if (stepsResult.length === 0) {
          const params = {
            docId,
            historic: [
              {
                timestamp: req.body.timestamp,
                hourlySteps: [req.body.stepCount],
                totalStepCount: req.body.stepCount,
                date: req.body.date,
                tier: req.body.tier,
                weekNumber: req.body.weekNumber,
              },
            ],
            tier: req.body.tier,
            awards: [],
          };
          queries.createSteps(params).then(() => {
            userFlow.userFlow(req).then((data) => {
              resolve(data);
            });
          });
        } else {
          stepsDocExists(stepsResult, req, docId).then(() => {
            resolve("Updated Succesfully");
          });
        }
      })
      .catch((error) => reject(error));
  });
};
