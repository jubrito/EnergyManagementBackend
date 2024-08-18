const { calculateEnergyCost } = require("./usage");
const { convertMockToReadings } = require("../utils/convertMockToReadings");
const { meterReadingsMock } = require("../mocks/meter-readings");
const { meterPricePlanMap, meters } = require("../meters/meters");
const { storeReadings } = require("../readings/readings.data");
const {
  getPricePlanForSmartMeterId,
} = require("../price-plans/price-plans-controller");
const { HTTP_STATUS_CODES } = require("../constants/http-status");

const calculateEnergyCostBySmartMeterId = (getReadings, req) => {
  const readingsStoreURL = "http://localhost:8080/readings/store";
  const smartMeterId = req.params.smartMeterId;
  const attemptToGetPricePlanForSmartMeterId =
    getPricePlanForSmartMeterId(smartMeterId);
  if (
    attemptToGetPricePlanForSmartMeterId?.statusCode ===
    HTTP_STATUS_CODES.NOT_FOUND
  ) {
    return {
      errorMessage: attemptToGetPricePlanForSmartMeterId.message,
      statusCode: attemptToGetPricePlanForSmartMeterId.statusCode,
    };
  }
  const pricePlanForSmartMeterId =
    attemptToGetPricePlanForSmartMeterId.pricePlan;
  const pricePerKWHInPounds = pricePlanForSmartMeterId.rate;
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
