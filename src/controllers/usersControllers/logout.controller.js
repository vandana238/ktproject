/* eslint-disable no-console */
const logger = require("@miraclesoft/logger");
const User = require("../../models/users.model");
const status = require("../../utils/httpCode.util");
// eslint-disable-next-line no-unused-vars
exports.logout = (req, res, next) => {
  User.findOne({ userId: req.body.userId }).then((userData) => {
    console.log("userData", userData);
    console.log("USER REQ FOR /logout", req.body.userId);
    logger.info(req.body.userId);
    User.updateOne(
      { userId: req.body.userId },
      {
        $set: { isLoggedin: false },
      }
    )
      .then((userDeleted) => {
        if (userDeleted.nModified !== 0) {
          console.log(
            "USER RES FOR /logout succesfully logged out",
            req.body.userId
          );
          logger.info(req.body.userId);
          res
            .status(status.OK)
            .send({ status: true, message: "Loggedout successfully." });
        } else
          res.status(204).json({ status: false, message: "No user found" });
      })
      .catch((error) => {
        next(error);
      });
  });
};
