/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable vars-on-top */
/* eslint-disable valid-typeof */
/* eslint-disable no-param-reassign */
/* eslint-disable no-extend-native */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-loop-func */
/* eslint-disable radix */
/* eslint-disable eqeqeq */
// const _ = require("lodash");
// const moment = require("moment");
const logger = require("@miraclesoft/logger");
const User = require("../../models/users.model");
const status = require("../../utils/httpCode.util");

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
exports.leaderboard = (req, res, next) => {
  console.log(
    "USER REQ FOR /leaderboard",
    req.params.tier,
    req.query.userId,
    req.query.weekNumber
  );
  logger.info(req.query);
  logger.info(req.params);
  let userRank = 1;
  let rank = 0;
  const matchQuery = {};
  const countQuery = {};
  const userData = [];

  // const currentWeekNumber = moment().week();
  // // eslint-disable-next-line no-console
  // console.log(
  //   "weeknumber",
  //   currentWeekNumber,
  //   req.query.weekNumber,
  //   req.params.tier
  // );
  if (req.params.tier != "all") {
    countQuery.tier = req.params.tier;
    matchQuery.tier = req.params.tier;
  }
  // User.find(matchQuery)
  User.find({
    $and: [
      matchQuery,
      {
        $or: [
          {
            "lastSevenEntries.weekArray.weekNumber": Number(
              req.query.weekNumber
            ),
          },
          { "lastSevenEntries.totalWeekSteps": 0 },
        ],
      },
    ],
  })
    .sort({ "lastSevenEntries.totalWeekSteps": -1 })
    .then((usersRecords) => {
      if (usersRecords.length > 0) {
        for (let j = 0; j < usersRecords.length; j += 1) {
          if (
            j > 0 &&
            usersRecords[j].lastSevenEntries.totalWeekSteps <
              usersRecords[j - 1].lastSevenEntries.totalWeekSteps
          ) {
            userRank += 1;
          }

          if (req.query.userId == usersRecords[j].userId) {
            userData.push({ rank: userRank, ...usersRecords[j]._doc });
            break;
          }
        }
        User.countDocuments(countQuery)
          .then((countData) => {
            // User.find(matchQuery)
            User.find({
              $and: [
                matchQuery,
                {
                  "lastSevenEntries.weekArray.weekNumber": Number(
                    req.query.weekNumber
                  ),
                },
              ],
            })
              .sort({ "lastSevenEntries.totalWeekSteps": -1 })
              .limit(10)
              .then((sortedUsers) => {
                if (sortedUsers.length > 0) {
                  for (let i = 0; i < sortedUsers.length; i += 1) {
                    if (
                      i == 0 &&
                      req.query.lastValue ==
                        sortedUsers[i].lastSevenEntries.totalWeekSteps
                    ) {
                      rank = parseInt(req.query.ranking);
                    } else if (
                      i == 0 &&
                      req.query.lastValue !=
                        sortedUsers[i].lastSevenEntries.totalWeekSteps
                    ) {
                      rank += 1;
                    }
                    if (
                      i > 0 &&
                      sortedUsers[i].lastSevenEntries.totalWeekSteps <
                        sortedUsers[i - 1].lastSevenEntries.totalWeekSteps
                    ) {
                      rank += 1;
                    }
                    // eslint-disable-next-line no-param-reassign
                    sortedUsers[i] = { rank, ...sortedUsers[i]._doc };
                    if (Number(i) === sortedUsers.length - 1) {
                      if (
                        userData[0] != undefined &&
                        (userRank > 10 ||
                          !sortedUsers.some(
                            (e) => e.userId === userData[0].userId
                          ))
                      ) {
                        sortedUsers.push(userData[0]);
                        console.log(
                          "USER RES FOR /leaderboard",
                          sortedUsers,
                          countData
                        );
                        logger.info(sortedUsers);
                        res.status(status.OK).json({
                          data: sortedUsers,
                          count: countData,
                        });
                        break;
                      } else if (userData[0] == undefined) {
                        console.log(
                          "USER RES FOR /leaderboard",
                          sortedUsers,
                          countData
                        );
                        logger.info(sortedUsers);
                        res.status(status.OK).json({
                          data: sortedUsers,
                          count: countData,
                        });
                        break;
                      } else {
                        console.log(
                          "USER RES FOR /leaderboard",
                          sortedUsers,
                          countData
                        );
                        logger.info(sortedUsers);
                        res.status(status.OK).json({
                          data: sortedUsers,
                          count: countData,
                        });
                        break;
                      }
                    }
                  }
                } else {
                  res.status(status.OK).json({ data: [] });
                }
              })
              .catch((error) => {
                next(error);
              });
          })
          .catch((error) => {
            next(error);
          });
      } else {
        res.status(status.OK).json({ data: [] });
      }
    })
    .catch((error) => {
      next(error);
    });
};
