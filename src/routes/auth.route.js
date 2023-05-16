const express = require("express");

const router = express.Router();
const schema = require("../schemas/apiRequest.schema");
const joiValidator = require("../schemas/validation.schema");
const loginController = require("../controllers/usersControllers/login.controller");
const logoutController = require("../controllers/usersControllers/logout.controller");
// const tokenController = require("../controllers/usersControllers/token.controller");

router.post(
  "/login",
  joiValidator.postData(schema.loginSchema),
  loginController.login
);

router.post(
  "/logout",
  joiValidator.postData(schema.logoutSchema),
  logoutController.logout
);

module.exports = router;
