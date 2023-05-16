/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const axios = require("axios");
// const { v4: uuidv4 } = require('uuid');
// const hash = require("md5");
const logger = require("@miraclesoft/logger");
const status = require("../../utils/httpCode.util");
const User = require("../../models/users.model");
const { tiers } = require("../../utils/awards");
// eslint-disable-next-line no-unused-vars
exports.login = (req, res, next) => {
  console.log(
    "USER REQ BODY FOR /login",
    req.body.loginId,
    req.body.dateOfJoining,
    req.body.deviceID,
    req.body.logoutDevice
  );
  logger.info(req.body.loginId);
  const authDetails = {
    LoginId: req.body.loginId,
    Password: req.body.password,
    Authorization: "YWRtaW46YWRtaW4=",
  };

  axios
    .post(
      "https://www.miraclesoft.com/HubbleServices/hubbleresources/generalServices/doMintLogin",
      authDetails
    )
    .then((hubbleResult) => {
      if (
        hubbleResult.data.IsAuthenticate &&
        hubbleResult.data.ResultString === "Valid"
      ) {
        User.findOne({ userId: req.body.loginId })
          .then((userFound) => {
            const data = {
              IsAuthenticate: hubbleResult.data.IsAuthenticate,
              Image: hubbleResult.data.Image,
              FName: hubbleResult.data.FName,
              IsOperationContactTeam: hubbleResult.data.IsOperationContactTeam,
              Email1: hubbleResult.data.Email1,
              MName: hubbleResult.data.MName,
              ResultString: hubbleResult.data.ResultString,
              LoginId: hubbleResult.data.LoginId,
              LName: hubbleResult.data.LName,
              PracticeId: hubbleResult.data.PracticeId,
              Country: hubbleResult.data.Country,
              Location: hubbleResult.data.Location,
            };
            // here loggedin value is false
            if (userFound) {
              const userData = {
                alias: userFound.alias,
                height: userFound.height,
                weight: userFound.weight,
                highestTier: userFound.highestTier,
                dateOfJoining: userFound.dateOfJoining,
              };
              // here loggedin value is true
              if (userFound.isLoggedin) {
                if (req.body.logoutDevice == undefined) {
                  // user is already loggedin response is sent here
                  res.status(status.FORBIDDEN).json({
                    success: false,
                    message: "User Already Logged In",
                  });
                }
                if (req.body.logoutDevice == false) {
                  // do nothing
                  // same loggedin true
                  res.status(status.NOT_FOUND).json({
                    success: false,
                    message: "Redirect to Login",
                  });
                } else if (req.body.logoutDevice == true) {
                  // get the device ID from DB and store it in blacklisted db
                  // update the jwt, refreshtoken, update the deviceid
                  const token = jwt.sign(
                    { userId: req.body.loginId, deviceID: req.body.deviceID },
                    process.env.secretKey,
                    { expiresIn: "30m" }
                  );
                  const refreshToken = jwt.sign(
                    {
                      userId: req.body.loginId,
                      deviceID: req.body.deviceID,
                      dateOfJoining: req.body.dateOfJoining,
                    },
                    process.env.secretKey,
                    { expiresIn: "365d" }
                  );

                  // const checkData = ["date", "stepCount"];
                  // const checksumData = hash(checkData);

                  // User.findOne({userId: req.body.loginId}).then((result) =>{
                  // console.log("userData", result)
                  User.updateOne(
                    { userId: req.body.loginId },
                    {
                      $set: { deviceID: req.body.deviceID },
                    }
                  ).then(() => {
                    console.log("resulttt", userData);
                    Object.assign(data, userData);
                    console.log(
                      "USER RES FOR /login",
                      data,
                      req.body.deviceID,
                      tiers
                    );
                    logger.info(data);
                    res.header("Authorization", `Bearer ${token}`);
                    res.header("refreshToken", refreshToken);
                    res.status(status.OK).json({
                      success: true,
                      message: "login successful",
                      // token,
                      user: data,
                      deviceID: req.body.deviceID,
                      // checksum: checksumData,
                      goalValue: tiers,
                    });
                  });
                  // })
                }
              } else {
                // const checkData = ["date", "stepCount"];
                // const checksumData = hash(checkData);

                // eslint-disable-next-line no-shadow
                const token = jwt.sign(
                  { userId: req.body.loginId, deviceID: req.body.deviceID },
                  process.env.secretKey,
                  { expiresIn: "30m" }
                );
                const refreshToken = jwt.sign(
                  {
                    userId: req.body.loginId,
                    deviceID: req.body.deviceID,
                    dateOfJoining: req.body.dateOfJoining,
                  },
                  process.env.secretKey,
                  { expiresIn: "365d" }
                );

                User.updateOne(
                  { userId: req.body.loginId },
                  {
                    $set: {
                      isLoggedin: true,
                      deviceID: req.body.deviceID,
                      // refreshToken
                    },
                  }
                ).then(() => {
                  Object.assign(data, userData);
                  res.header("Authorization", `Bearer ${token}`);
                  res.header("refreshToken", refreshToken);
                  console.log(
                    "USER RES FOR /login",
                    data,
                    req.body.deviceID,
                    tiers
                  );
                  logger.info(data);
                  res.status(status.OK).json({
                    success: true,
                    message: "login successful",
                    // token,
                    user: data,
                    deviceID: req.body.deviceID,
                    // checksum: checksumData,
                    goalValue: tiers,
                  });
                });
              }
            } else {
              // no user is in db
              // const checkData = ["date", "stepCount"];
              // const checksumData = hash(checkData);

              const token = jwt.sign(
                { userId: req.body.loginId, deviceID: req.body.deviceID },
                process.env.secretKey,
                { expiresIn: "30m" }
              );

              const refreshToken = jwt.sign(
                {
                  userId: req.body.loginId,
                  deviceID: req.body.deviceID,
                  dateOfJoining: req.body.dateOfJoining,
                },
                process.env.secretKey,
                { expiresIn: "365d" }
              );

              const params = {
                userId: req.body.loginId,
                username: `${hubbleResult.data.FName} ${hubbleResult.data.LName}`,
                profilePicture: hubbleResult.data.Image,
                lifetimeSteps: 0,
                isLoggedin: true,
                awards: [],
                tier: "Bronze",
                dateOfJoining: req.body.dateOfJoining,
                // refreshToken: refreshToken,
                // deviceID: uuidv4(),
                deviceID: req.body.deviceID,
              };
              newUser = new User(params);
              newUser.save().then((newUserResult) => {
                if (newUserResult) {
                  const userData = {
                    alias: newUserResult.alias,
                    height: newUserResult.height,
                    weight: newUserResult.weight,
                    highestTier: newUserResult.highestTier,
                    dateOfJoining: newUserResult.dateOfJoining,
                  };
                  Object.assign(data, userData);
                  res.header("Authorization", `Bearer ${token}`);
                  res.header("refreshToken", refreshToken);
                  console.log(
                    "USER RES FOR /login",
                    data,
                    req.body.deviceID,
                    tiers
                  );
                  logger.info(data);
                  res.status(status.OK).json({
                    success: true,
                    message: "ok",
                    user: data,
                    deviceID: req.body.deviceID,
                    goalValue: tiers,
                  });
                } else {
                  res.status(status.NOT_FOUND).json({ message: "Not found!" });
                }
              });
            }
          })
          .catch((error) => {
            next(error);
          });
      } else {
        res
          .status(status.UNAUTHORIZED)
          .json({ success: false, message: "Invalid Credentials" });
      }
    })
    .catch((error) => {
      next(error);
    });
};
