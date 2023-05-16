/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const logger = require("@miraclesoft/logger");
const moment = require("moment");
const lifeSteps = require("./lifeSteps.controller");
const awardsArray = require("../../utils/awards").awardsJson;
const award = require("./award.controller");

exports.addSteps = (req, res, next) => {
  console.log("USER REQ FOR /api/steps", req.body);
  logger.info(req.body);
  logger.info("Add Steps", awardsArray);
  const year = moment(req.body.date, "YYYY/MM/DD");
  const docId = `${req.body.userId}_${year.format("YYYY")}_${year.format(
    "MM"
  )}`;

  lifeSteps
    .update(req.body)
    .then(() => {
      lifeSteps
        .noDocExists(docId, req)
        .then(() => {
          award
            .checker(req, awardsArray)
            .then((resultAward) => {
              console.log("USER RES FOR /api/steps", resultAward);
              logger.info(resultAward);
              res.status(200).send(resultAward);
            })
            .catch((err) => res.status(404).json({ message: err }));
        })
        .catch((err) => res.status(404).json({ message: err }));
    })
    .catch((err) => res.status(404).json({ message: err }));
};
