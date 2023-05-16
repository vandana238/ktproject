/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
const logger = require("@miraclesoft/logger");
const groupBy = require("lodash/groupBy");
const moment = require("moment");
const status = require("../../utils/httpCode.util");
const queries = require("../../utils/queries");

const docIds = (docId, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const timeValues = [];
    const dateStart = moment(new Date(startDate));
    const dateEnd = moment(new Date(endDate));
    while (
      dateEnd > dateStart ||
      dateStart.format("M") === dateEnd.format("M")
    ) {
      timeValues.push(
        `${docId}_${dateStart.format("YYYY")}_${dateStart.format("MM")}`
      );
      dateStart.add(1, "month");
    }

    resolve({ docIds: timeValues });
  });
};

// eslint-disable-next-line no-unused-vars
exports.getHistoricSteps = (req, res, next) => {
  console.log(
    "USER REQ FOR /historicsteps",
    req.query.startDate,
    req.params.userId,
    req.query.endDate
  );
  logger.info(req.params);
  logger.info(req.query);
  let historyDate;
  if (req.query.startDate == 0) {
    historyDate = moment().subtract(60, "days").format("YYYY/MM/DD");
  } else {
    historyDate = req.query.startDate;
  }
  if (req.query.startDate === undefined) {
    res.status(500).json({ message: "Internal error" });
  } else {
    queries
      .findUsers({ userId: req.params.userId })
      .then((userData) => {
        const finalData = {
          lifetimeSteps: userData[0].lifetimeSteps,
          tier: userData[0].tier,
          historic: [],
        };

        docIds(
          req.params.userId,
          historyDate,
          req.query.endDate
          // moment().subtract(60, "days").format("YYYY/MM/DD"),
          // moment().format("YYYY/MM/DD")
        )
          .then((data) => {
            queries
              .aggregateSteps([
                { $unwind: "$historic" },
                {
                  $match: {
                    $and: [
                      {
                        "historic.date": {
                          // $gte: moment()
                          //   .subtract(60, "days")
                          //   .format("YYYY/MM/DD"),
                          // $lte: moment().format("YYYY/MM/DD"),
                          $gte: historyDate,
                          $lte: req.query.endDate,
                        },
                      },
                      {
                        docId: { $in: data.docIds },
                      },
                    ],
                  },
                },
                { $sort: { "historic.date": -1 } },
                {
                  $project: {
                    date: "$historic.date",
                    totalStepCount: "$historic.totalStepCount",
                    weekNumber: "$historic.weekNumber",
                    timeStamp: "$historic.timestamp",
                    _id: 0,
                  },
                },
              ])
              .then((userDoc) => {
                const groupByMonth = groupBy(
                  userDoc,
                  (dt) => moment(new Date(dt.date)).month() + 1
                );
                Object.keys(groupByMonth).forEach((ele) => {
                  finalData.historic.push({
                    month: ele,
                    data: groupByMonth[ele],
                  });
                });
                console.log("USER RES FOR /historicsteps", finalData);
                logger.info(finalData);
                res.status(status.OK).json(finalData);
              });
          })
          .catch((error) => {
            next(error);
          });
      })
      .catch((error) => {
        next(error);
      });
  }
};
