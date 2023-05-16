/* eslint-disable no-console */
const logger = require("@miraclesoft/logger");
const Steps = require("../../models/steps.model");
const status = require("../../utils/httpCode.util");

// eslint-disable-next-line no-unused-vars
exports.add = (req, res, next) => {
  console.log("USER RES FOR /previousday", req.body);
  logger.info(req.body);
  const { userId } = req.body;

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const twoDigitMonth = month >= 10 ? month : `0${month}`;
  const document = `${userId}_${year}_${twoDigitMonth}`;
  const allrecords = [];
  const hourlySteps = [];

  req.body.records.forEach((element) => {
    const elements = element;
    elements.timestamp = new Date(elements.date).getTime();
    elements.weekNumber = req.body.weekNumber;
    elements.hourlySteps = hourlySteps;
    allrecords.push(elements);
  });
  Steps.updateOne(
    { docId: document },
    {
      $addToSet: {
        historic: {
          $each: allrecords,
        },
      },
    }
  )
    .then((updateSteps) => {
      if (updateSteps) {
        console.log("USER RES FOR /previousday", updateSteps);
        logger.info(updateSteps);
        res.status(status.OK).send(updateSteps);
      } else res.status(status.NOT_FOUND).json({ message: "Not found!" });
    })
    .catch((error) => {
      next(error);
    });
};
