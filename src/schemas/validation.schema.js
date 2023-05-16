const Joi = require("joi");

module.exports.postData = (schema) => (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    return next(result.error);
  }
  return next();
};

module.exports.getData = (schema) => (req, res, next) => {
  const result = Joi.validate(req.params, schema);
  if (result.error) {
    return next(result.error);
  }
  return next();
};
