/* eslint-disable no-console */
const logger = require("@miraclesoft/logger");
const queries = require("../../utils/queries");

exports.userFlow = (req) => {
  logger.info("User Flow");
  return new Promise((resolve, reject) => {
    const queryMatch = { userId: req.body.userId };
    const showFields = { "lastSevenEntries.weekArray": { $slice: -1 } };
    queries
      .findUsers(queryMatch, showFields)
      .then((userData) => {
        if (
          userData[0].lastSevenEntries.weekArray.length === 0 ||
          userData[0].lastSevenEntries.weekArray[0].weekNumber !==
            req.body.weekNumber
        ) {
          queries
            .updateUsers(
              { userId: req.body.userId },
              {
                $set: {
                  "lastSevenEntries.weekArray": [
                    {
                      date: req.body.date,
                      totalSteps: req.body.stepCount,
                      weekNumber: req.body.weekNumber,
                    },
                  ],
                  "lastSevenEntries.totalWeekSteps": req.body.stepCount,
                },
              }
            )
            .then((updateResult) => {
              resolve(updateResult);
            });
        } else if (
          userData[0].lastSevenEntries.weekArray[0].date !== req.body.date
        ) {
          queries
            .updateUsers(
              { userId: req.body.userId },
              {
                $set: {
                  "lastSevenEntries.totalWeekSteps":
                    userData[0].lastSevenEntries.totalWeekSteps +
                    req.body.stepCount,
                },
                $push: {
                  "lastSevenEntries.weekArray": {
                    date: req.body.date,
                    totalSteps: req.body.stepCount,
                    weekNumber: req.body.weekNumber,
                  },
                },
              }
            )
            .then(() => {
              resolve("Updated");
            });
        } else {
          queries
            .updateUsers(
              {
                userId: req.body.userId,
                "lastSevenEntries.weekArray.date": req.body.date,
              },
              {
                $set: {
                  "lastSevenEntries.weekArray.$.totalSteps": req.body.stepCount,
                  "lastSevenEntries.totalWeekSteps":
                    userData[0].lastSevenEntries.totalWeekSteps +
                    (req.body.stepCount -
                      userData[0].lastSevenEntries.weekArray[0].totalSteps),
                },
              }
            )
            .then(() => {
              resolve("Updated");
            });
        }
      })
      .catch((error) => reject(error));
  });
};
