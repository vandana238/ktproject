/* eslint-disable no-console */
const logger = require("@miraclesoft/logger");
const User = require("../../models/users.model");
const status = require("../../utils/httpCode.util");
// eslint-disable-next-line no-unused-vars
exports.add = (req, res, next) => {
  console.log("USER REQ FOR /userdetails", req.body);
  logger.info(req.body);
  User.updateOne(
    { userId: req.body.userId },
    {
      $set: {
        alias: req.body.alias,
        height: req.body.height,
        weight: req.body.weight,
      },
    }
  )
    .then((updateUserDetails) => {
      if (updateUserDetails.n === 0) {
        res
          .status(status.NOT_FOUND)
          .json({ status: false, message: "User Data not found!" });
      } else {
        console.log(
          "USER RES FOR /userdetails sucessfully added",
          req.body.userId
        );
        logger.info(req.body.userId);
        res
          .status(status.OK)
          .send({ status: true, message: "Details added successfully." });
      }
    })
    .catch((error) => {
      next(error);
    });
};
