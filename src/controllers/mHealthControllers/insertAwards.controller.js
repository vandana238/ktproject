const Awards = require("../../models/awards.model");
const status = require("../../utils/httpCode.util");
// eslint-disable-next-line no-unused-vars
exports.insert = (req, res, next) => {
  const newAward = new Awards(req.body);
  newAward
    .save()
    .then((addedAward) => {
      if (addedAward) {
        res.status(status.OK).send(addedAward);
      } else {
        res.status(409).json({ message: "Award is already created." });
      }
    })
    // eslint-disable-next-line no-unused-vars
    .catch((error) => {
      next(error);
    });
};
