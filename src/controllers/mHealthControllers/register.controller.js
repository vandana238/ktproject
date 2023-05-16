const Steps = require("../../models/steps.model");

// eslint-disable-next-line no-unused-vars
exports.register = (req, res, next) => {
  req.body.historic = [
    {
      timestamp: `${new Date()
        .getMonth()
        .toLocaleString()}/${new Date()
        .getDate()
        .toLocaleString()}/${new Date().getFullYear()}`,
      stepsCount: 0,
    },
  ];

  const newUser = new Steps(req.body);
  newUser
    .save()
    .then((addedUser) => {
      if (addedUser) {
        res.status(200).send(addedUser);
      } else {
        res
          .status(409)
          .json({ message: "User with that empId is already registered." });
      }
    })
    .catch((error) => {
      next(error);
    });
};
