const { pricePlans } = require("./price-plans");
const { usageForAllPricePlans } = require("../usage/usage");
const { meterPricePlanMap } = require("../meters/meters");
const { HTTP_STATUS_CODES } = require("../constants/http-status");

const recommend = (getReadings, req) => {
  const meter = req.params.smartMeterId;
  const pricePlanComparisons = usageForAllPricePlans(
    pricePlans,
    getReadings(meter)
  ).sort((a, b) => extractCost(a) - extractCost(b));
  if ("limit" in req.query) {
    return pricePlanComparisons.slice(0, req.query.limit);
  }
  return pricePlanComparisons;
};

const extractCost = (cost) => {
  const [, value] = Object.entries(cost).find(([key]) => key in pricePlans);
  return value;
};

const compare = (getData, req) => {
  const meter = req.params.smartMeterId;
  const pricePlanComparisons = usageForAllPricePlans(
    pricePlans,
    getData(meter)
  );
  return {
    smartMeterId: req.params.smartMeterId,
    pricePlanComparisons,
  };
};

const getPricePlanForSmartMeterId = (smartMeterId) => {
  const pricePlan = meterPricePlanMap[smartMeterId];
  if (pricePlan == null) {
    return {
      message: `No price plan found for the smart meter id '${smartMeterId}'`,
      statusCode: HTTP_STATUS_CODES.NOT_FOUND,
    };
  }
  return {
    message: `A price plan was found for the smart meter id '${smartMeterId}'`,
    statusCode: 200,
    pricePlan,
  };
};

module.exports = { recommend, compare, getPricePlanForSmartMeterId };
