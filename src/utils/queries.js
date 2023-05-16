const User = require("../models/users.model");
const Steps = require("../models/steps.model");

exports.createUsers = (query) => {
  return new Promise((resolve, reject) => {
    User.create(query)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Update Failed"));
        }
      })
      .catch((err) => reject(err));
  });
};
exports.updateUsers = (queryMatch, queryOperation) => {
  return new Promise((resolve, reject) => {
    User.update(queryMatch, queryOperation)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Update Failed"));
        }
      })
      .catch((err) => reject(err));
  });
};

exports.updateOneUsers = (queryMatch, queryOperation) => {
  return new Promise((resolve, reject) => {
    User.updateOne(queryMatch, queryOperation)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Update Failed"));
        }
      })
      .catch((err) => reject(err));
  });
};
exports.findUsers = (queryMatch, showFields) => {
  return new Promise((resolve, reject) => {
    User.find(queryMatch, showFields)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Update Failed"));
        }
      })
      .catch((err) => reject(err));
  });
};

exports.findOneUsers = (queryMatch, showFields) => {
  return new Promise((resolve, reject) => {
    User.findOne(queryMatch, showFields)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Update Failed"));
        }
      })
      .catch((err) => reject(err));
  });
};
exports.updateSteps = (queryMatch, queryOperation) => {
  return new Promise((resolve, reject) => {
    Steps.update(queryMatch, queryOperation)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Update Failed"));
        }
      })
      .catch((err) => reject(err));
  });
};

exports.updateOneSteps = (queryMatch, queryOperation) => {
  return new Promise((resolve, reject) => {
    Steps.updateOne(queryMatch, queryOperation)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Update Failed"));
        }
      })
      .catch((err) => reject(err));
  });
};
exports.findSteps = (queryMatch, showFields) => {
  return new Promise((resolve, reject) => {
    Steps.find(queryMatch, showFields)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Update Failed"));
        }
      })
      .catch((err) => reject(err));
  });
};
exports.createSteps = (query) => {
  return new Promise((resolve, reject) => {
    Steps.create(query)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Update Failed"));
        }
      })
      .catch((err) => reject(err));
  });
};

exports.findOneSteps = (queryMatch, showFields) => {
  return new Promise((resolve, reject) => {
    Steps.findOne(queryMatch, showFields)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Update Failed"));
        }
      })
      .catch((err) => reject(err));
  });
};
exports.aggregateSteps = (query) => {
  return new Promise((resolve, reject) => {
    Steps.aggregate(query)
      .then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Update Failed"));
        }
      })
      .catch((err) => reject(err));
  });
};
