/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const moment = require("moment");
const _ = require("lodash");
const logger = require("@miraclesoft/logger");
const awardss = require("../models/awards.model");

const awardsArray = [];
const awardsJSON = [
  {
    awardId: [],
    awardName: [],
    awardDescriptionRange: [],
    category: 1,
  },
  {
    awardId: [],
    awardName: [],
    awardDescriptionRange: [],
    category: 2,
  },
  {
    awardId: [],
    awardName: [],
    awardDescriptionRange: [],
    category: 4,
  },
  {
    awardId: [],
    awardName: [],
    awardDescriptionRange: [],
    category: 5,
  },
  {
    awardId: [],
    awardName: [],
    awardDescriptionRange: [],
    category: 6,
  },
  {
    awardId: [],
    awardName: [],
    awardDescriptionRange: [],
    category: 7,
  },
  {
    awardId: [],
    awardName: [],
    awardDescriptionRange: [],
    category: 8,
  },
];
const tiers = [
  {
    tierName: "Bronze",
    goal: 3000,
  },
  {
    tierName: "Silver",
    goal: 5000,
  },
  {
    tierName: "Gold",
    goal: 7000,
  },
  {
    tierName: "Platinum",
    goal: 10000,
  },
];
awardss.find({}, (error, awardData) => {
  if (error) throw error;
  else {
    for (const awards in awardData) {
      // eslint-disable-next-line vars-on-top
      const index = _.findIndex(awardsJSON, (awardCategory) => {
        return awardCategory.category === awardData[awards].categoryType;
      });

      if (
        awardData[awards].isStreak === true &&
        awardData[awards].awardsSteps === -1
      ) {
        awardsJSON[index].awardName.push(awardData[awards].awardName);
        awardsJSON[index].awardId.push(awardData[awards].awardId);
        awardsJSON[index].awardDescriptionRange.push({
          totlen: awardData[awards].totalDays,
          timestamp: moment()
            .subtract(awardData[awards].totalDays, "days")
            .valueOf(),
        });
      } else if (
        awardData[awards].isStreak === true &&
        awardData[awards].awardsSteps !== -1
      ) {
        awardsJSON[index].awardName.push(awardData[awards].awardName);
        awardsJSON[index].awardId.push(awardData[awards].awardId);
        awardsJSON[index].awardDescriptionRange.push({
          totlen: awardData[awards].totalDays,
          timestamp: moment()
            .subtract(awardData[awards].totalDays, "days")
            .valueOf(),
          value: awardData[awards].awardsSteps,
        });
      } else if (awardData[awards].categoryType === 6) {
        awardsJSON[index].awardName.push(awardData[awards].awardName);
        awardsJSON[index].awardId.push(awardData[awards].awardId);
        if (awardData[awards].awardId === "CAT06_July4th") {
          awardsJSON[index].awardDescriptionRange.push({
            totsteps: awardData[awards].awardsSteps,
            date: "07/04",
          });
        }
        if (awardData[awards].awardId === "CAT06_Aug15th") {
          awardsJSON[index].awardDescriptionRange.push({
            totsteps: awardData[awards].awardsSteps,
            date: "08/15",
          });
        }
        if (awardData[awards].awardId === "CAT06_NewYear") {
          awardsJSON[index].awardDescriptionRange.push({
            totsteps: awardData[awards].awardsSteps,
            date: "01/01",
          });
        }
        if (awardData[awards].awardId === "CAT06_Diwali") {
          awardsJSON[index].awardDescriptionRange.push({
            totsteps: awardData[awards].awardsSteps,
            date: "11/14",
          });
        }
      } else if (awardData[awards].categoryType === 8) {
        awardsJSON[index].awardName.push(awardData[awards].awardName);
        awardsJSON[index].awardId.push(awardData[awards].awardId);
      } else {
        awardsJSON[index].awardName.push(awardData[awards].awardName);
        awardsJSON[index].awardId.push(awardData[awards].awardId);
        awardsJSON[index].awardDescriptionRange.push(
          awardData[awards].awardsSteps
        );
      }
      if (awards === awardData.length - 1) {
        logger.info("$$$$$$");
      }
    }
    for (const i in awardsJSON) {
      if (awardsJSON[i].category === 1) {
        for (const j in awardsJSON[i].awardDescriptionRange) {
          const awardItem = {
            awardId: awardsJSON[i].awardId[j],
            awardName: awardsJSON[i].awardName[j],
            awardDescriptionRange: awardsJSON[i].awardDescriptionRange[j],
            category: awardsJSON[i].category,
          };
          awardsArray.push(awardItem);
        }
      }
    }
    awardsArray.sort((a, b) => {
      return a.awardDescriptionRange - b.awardDescriptionRange;
    });
    const awardObject = {
      awardId: [],
      awardName: [],
      awardDescriptionRange: [],
      category: 1,
    };
    awardsArray.forEach((element) => {
      awardObject.awardId.push(element.awardId);
      awardObject.awardName.push(element.awardName);
      awardObject.awardDescriptionRange.push(element.awardDescriptionRange);
    });

    for (const i in awardsJSON) {
      if (awardsJSON[i].category === 1) {
        awardsJSON[i] = awardObject;
        break;
      }
    }
  }
});

module.exports = {
  awardsJson: awardsJSON,
  tiers,
};
