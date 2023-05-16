const User = require("../../models/users.model");

// Helper Functions
// eslint-disable-next-line no-unused-vars
exports.findUser = (req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  User.findOne({ userId: req.query.userId }).then((response) => {});
};

// eslint-disable-next-line no-unused-vars
exports.find = (req, res, next) => {
  res.send("True");
};
