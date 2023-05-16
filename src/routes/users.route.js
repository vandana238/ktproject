const express = require("express");

const router = express.Router();
const schema = require("../schemas/apiRequest.schema");
const joiValidator = require("../schemas/validation.schema");
const userDetailsController = require("../controllers/usersControllers/userDetails.controller");
const findUserController = require("../controllers/usersControllers/findUser.controller");

router.post(
  "/details",
  joiValidator.postData(schema.userDetails),
  userDetailsController.add
);

router.get(
  "/:userID",
  joiValidator.getData(schema.userSchema),
  findUserController.findUser
);

module.exports = router;
