/* eslint-disable no-console */
const logger = require("@miraclesoft/logger");
const User = require("../../models/users.model");
const status = require("../../utils/httpCode.util");
/* eslint-disable eqeqeq */
// eslint-disable-next-line no-unused-vars
exports.rank = (req, res, next) => {
  console.log("USER REQ FOR /rank/:tier/:id", req.params);
  logger.info(req.params);
  let rank = 1;
  const userData = [];
  const matchQuery = {};
  if (req.params.tier != "all") {
    matchQuery.tier = req.params.tier;
  }
  User.find(matchQuery, { awards: 0 })
    .sort({ "lastSevenEntries.totalWeekSteps": -1 })
    .then((resultData) => {
      if (resultData.length > 0) {
        for (let j = 0; j < resultData.length; j += 1) {
          if (
            j > 0 &&
            resultData[j].lastSevenEntries.totalWeekSteps <
              resultData[j - 1].lastSevenEntries.totalWeekSteps
          ) {
            rank += 1;
          }
          if (req.params.id == resultData[j].userId) {
            // eslint-disable-next-line no-param-reassign
            userData.push({ rank, ...resultData[j]._doc });
            console.log("USER RES FOR /rank/:tier/:id", userData);
            logger.info(userData);
            res.status(status.OK).json({ data: userData });
            break;
          }
        }
      } else {
        res.status(status.OK).json({ data: [] });
      }
    })
    .catch((error) => next(error));
};
