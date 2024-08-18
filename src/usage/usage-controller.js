const { calculateEnergyCost } = require("./usage");
const { convertMockToReadings } = require("../utils/convertMockToReadings");
const { meterReadingsMock } = require("../mocks/meter-readings");
const { meterPricePlanMap, meters } = require("../meters/meters");
const { storeReadings } = require("../readings/readings.data");
const {
  validatePricePlanForSmartMeterId,
} = require("../validations/price-plan-validations");
const { HTTP_STATUS_CODES } = require("../constants/http-status");

const calculateEnergyCostBySmartMeterId = (getReadings, req) => {
  const readingsStoreURL = "http://localhost:8080/readings/store";
  const smartMeterId = req.params.smartMeterId;
  const pricePlan = meterPricePlanMap[smartMeterId];
  const pricePlanValidation = validatePricePlanForSmartMeterId(
    pricePlan,
    smartMeterId
  );
  if (pricePlanValidation?.statusCode === HTTP_STATUS_CODES.NOT_FOUND) {
    return {
      errorMessage: pricePlanValidation.message,
      statusCode: pricePlanValidation.statusCode,
    };
  }
  const pricePerKWHInPounds = pricePlan.rate;
  let readings;
  if (smartMeterId === meters.METER_WITH_PRICE_PLAN) {
    readings = convertMockToReadings(meterReadingsMock);
  } else {
    readings = getReadings(smartMeterId);
  }
  storeReadings(readingsStoreURL, readings, smartMeterId);
  return { energyCost: calculateEnergyCost(readings, pricePerKWHInPounds) };
};

module.exports = { calculateEnergyCostBySmartMeterId };
