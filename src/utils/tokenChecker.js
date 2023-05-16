/* eslint-disable no-lonely-if */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint no-lonely-if: "error" */
/* eslint-disable consistent-return */
const logger = require("@miraclesoft/logger");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

module.exports = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // decode token
  if (token) {
    const { refreshtoken } = req.headers;
    if (!refreshtoken) {
      return res
        .status(401)
        .send({ message: "Refresh tokens not ound in headers" });
    }
    jwt.verify(refreshtoken, process.env.secretKey, (error, user) => {
      if (error) {
        return res.status(403).send({ message: "Refresh token is expired" });
      }
      User.findOne({ userId: user.userId }).then((userData) => {
        console.log("difference", user.exp - Math.floor(Date.now() / 1000));
        if (user.exp - Math.floor(Date.now() / 1000) < 172800) {
          const newRefreshToken = jwt.sign(
            {
              userId: user.userId,
              deviceID: user.deviceID,
              dateOfJoining: user.dateOfJoining,
            },
            process.env.secretKey,
            { expiresIn: "365d" }
          );
          res.header("refreshToken", newRefreshToken);
        }

        jwt.verify(token, process.env.secretKey, (err, decoded) => {
          if (err) {
            if (err.name === "JsonWebTokenError") {
              res
                .status(404)
                .send({ error: true, message: `${err.name} ${err.message}` });
            }
            if (err.name === "TokenExpiredError") {
              if (userData.deviceID == user.deviceID) {
                const jwtToken = jwt.sign(
                  { userId: user.userId, deviceID: user.deviceID },
                  process.env.secretKey,
                  { expiresIn: "30m" }
                );
                res.header("Authorization", `Bearer ${jwtToken}`);
                res.header("refreshToken", ` ${null}`);

                next();
              } else {
                console.log("USER REQ FOR /tokenchecker unauthrozed error");
                logger.info("Unauthorized Error");
                // payload doesnot match
                res.status(401).send({
                  error: true,
                  message: "Unauthorized Error, payload doesn't matched",
                });
              }
              // })
            }
          } else {
            if (userData.deviceID == decoded.deviceID) {
              req.decoded = decoded;
              res.header("Authorization", `${null}`);
              res.header("refreshToken", ` ${null}`);
              next();
            } else {
              console.log("USER REQ FOR /tokenchecker unauthrozed error");
              logger.info("Unauthorized Error");
              res.status(401).send({
                error: true,
                message: "Unauthorized Error, payload doesn't matched",
              });
            }
            // });
          }
        });
      });
    });
  } else {
    // if there is no token
    // return an error
    console.log("USER REQ FOR /tokenchecker ");
    logger.info("No Token Found");
    return res.status(403).send({
      error: true,
      message: "No token provided.",
    });
  }
};
