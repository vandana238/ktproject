/* eslint-disable no-console */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const logger = require("@miraclesoft/logger");
const _ = require("lodash");
const Awards = require("../../models/awards.model");
const queries = require("../../utils/queries");
const status = require("../../utils/httpCode.util");
// eslint-disable-next-line no-unused-vars
exports.find = (req, res, next) => {
  console.log("USER REQ FOR /findAwards", req.params.userId);
  logger.info(req.params.userId);
  queries
    .findUsers({ userId: req.params.userId }, { awards: 1, _id: 0 })
    .then((userAwards) => {
      if (userAwards[0].awards.length !== 0) {
        const finalIds = _.map(userAwards[0].awards, "awardId");
        Awards.find({ awardId: { $in: finalIds } }, { _id: 0, __v: 0 })
          .then((awardsData) => {
            for (const i in awardsData) {
              const aId = _.filter(userAwards[0].awards, {
                awardId: awardsData[i].awardId,
              });
              // eslint-disable-next-line no-param-reassign
              awardsData[i] = Object.assign(aId[0]._doc, awardsData[i]._doc);
              // eslint-disable-next-line eqeqeq
              if (i == awardsData.length - 1) {
                console.log("USER RES FOR /findAwards", awardsData);
                logger.info(awardsData);
                res.status(status.OK).json({ data: awardsData });
              }
            }
          })
          .catch((error) => next(error));
      } else {
        res.status(200).json({ data: [] });
      }
    })
    .catch((error) => next(error));
};
