// Require modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const logger = require("@miraclesoft/logger");
const httpLogger = require("@miraclesoft/http-logger");
const authRouter = require("./routes/auth.route");
const usersRouter = require("./routes/users.route");
const mHealthRouter = require("./routes/mHealth.route");
const userController = require("./controllers/usersControllers/findUser.controller");
const db = require("./utils/db");
const HTTP_CODES = require("./utils/httpCode.util");

// Initialize PORT variable from environment
const PORT = process.env.PORT || 3000;

// Initial express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Use Morgan to send API traffic logging to the logger
app.use(httpLogger);

// Initialize CORS options
app.use(cors());

// defining the JWT strategy
const passportStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.secretKey,
  },
  (jwtPayload, next) => {
    userController
      .findUser({ userId: jwtPayload.email })
      .then((user) => {
        next(null, user);
        // eslint-disable-next-line no-unused-vars
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        next(null, false);
      });
  }
);

// handle browser options Request
function handleOptionsReq(req, res, next) {
  if (req.method === "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
}

// init passport strategy
passport.use(passportStrategy);

// unsecured routes
app.use(authRouter);
// secured routes - all inside api/
/* passport.authenticate('jwt', { session: false }) */
app.use(require("./utils/tokenChecker"));

app.use("/api", handleOptionsReq);
app.use("/api/users", usersRouter);
app.use("/api", mHealthRouter);

// Add Error Handler for 404 - Route not found
app.use((req, res) => {
  logger.warn(`404 | Route : ${req.url}`);
  return res
    .status(HTTP_CODES.NOT_FOUND)
    .send({ message: `Route ${req.url} Not Found` });
});

// Error Handler for exceptions that might occurr within routes
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  logger.info(`500 | Route : ${req.url} | ${error.stack}`);

  if (error.isBoom) {
    const errorData = {
      code: HTTP_CODES.BAD_REQUEST,
      errors: [
        {
          domain: "mHealth",
          // eslint-disable-next-line no-useless-escape
          message: error.data[0].message.replace(/\"/g, ""),
        },
      ],
      message: "Enter a valid Query Parameter",
    };

    res.status(HTTP_CODES.BAD_REQUEST).json(errorData);
  } else if (error.status === 404) {
    const errorData = {
      code: HTTP_CODES.NOT_FOUND,
      errors: [
        {
          domain: "mHealth",
          message: "Invalid Request",
        },
      ],
      message: "Enter a valid Query or Path Parameter",
    };

    res.status(HTTP_CODES.NOT_FOUND).json(errorData);
  } else {
    const errorData = {
      code: HTTP_CODES.INTERNAL_SERVER_ERROR,
      errors: [
        {
          domain: "mHealth",
          message: "Invalid Request",
        },
      ],
      message: error.message,
    };

    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorData);
  }
});

// Initialize app and start server
(async () => {
  try {
    await db.init();
    app.listen(PORT, () => logger.info(`Server is running at 0.0.0.0:${PORT}`));
  } catch (error) {
    logger.error(error.message);
  }
})();
