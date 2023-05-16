/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const moment = require("moment");
const crypto = require("crypto");
const queries = require("../../utils/queries");
const category1 = require("./category1.controller");
const category5 = require("./category5.controller");
const category2 = require("./category2.controller");
const category8 = require("./category8.controller");
const userAwards = require("./userAwards.controller");

exports.checker = (req, awards) => {

  return new Promise((resolve, reject) => {
    const year = moment(req.body.date, "YYYY/MM/DD");
    const docId = `${req.body.userId}_${year.format("YYYY")}_${year.format(
      "MM"
    )}`;
    queries
      .findUsers(
        { userId: req.body.userId },
        { awards: 1, lifetimeSteps: 1, _id: 0 }
      )
      .then((userData) => {
        queries
          .aggregateSteps([
            { $unwind: "$historic" },
            {
              $match: {
                $and: [{ "historic.date": { $eq: req.body.date } }, { docId }],
              },
            },
          ])
          .then((userSteps) => {
            const awards1 = {
              totalStepCount: userSteps[0].historic.totalStepCount,
              awardss: userData[0].awards,
              userId: req.body.userId,
              date: req.body.date,
            };
            category1.category1(awards1, awards).then((category1Result) => {
              queries
                .aggregateSteps([
                  [
                    { $match: { docId } },
                    { $project: { historic: { $size: "$historic" } } },
                  ],
                ])
                .then((historicSize) => {
                  const categoryData = {
                    docId,
                    userId: req.body.userId,
                    totlen: historicSize[0].historic,
                    awardss: userData[0].awards,
                    tier: req.body.tier,
                    date: req.body.date,
                    week: req.body.weekNumber,
                    todaysteps: userSteps[0].historic.totalStepCount,
                    lifeSteps: userData[0].lifetimeSteps,
                  };
                  category2
                    .category2(categoryData, awards)
                    .then((category2Result) => {
                      category5
                        .category5(categoryData, awards)
                        .then((category5Result) => {
                          category8
                            .category8(categoryData, awards)
                            .then((category8Result) => {
                              const finalIds = category1Result.data
                                .concat(category2Result.data)
                                .concat(category5Result.data)
                                .concat(category8Result.data);
                              userAwards
                                .data(req, finalIds)
                                .then((finalData) => {                                  
				const checksum =req.body.date +req.body.stepCount;
				const crypt = crypto.createHash('sha256').update(checksum).digest('hex')
                                  resolve({
                                    data: finalData.data,
                                    tier: category8Result.tier,
                                    checksum: crypt,
                                  });
                                });
                            });
                        });
                    });
                });
            });
          });
      })
      .catch((error) => reject(error));
  });
};
