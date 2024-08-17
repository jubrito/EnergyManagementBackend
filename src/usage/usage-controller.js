const { calculateEnergyCost } = require("./usage");
const { convertMockToReadings } = require("../utils/convertMockToReadings");
const { meterReadingsMock } = require("../mocks/meter-readings");
const { meterPricePlanMap } = require("../meters/meters");
const { storeReadings } = require("../readings/readings.data");
const {
  validatePricePlanForSmartMeterId,
} = require("../validations/price-plan-validations");

const calculateEnergyCostBySmartMeterId = (getReadings, req) => {
  const readingsStoreURL = "http://localhost:8080/readings/store";
  const smartMeterId = req.params.smartMeterId;
  const pricePlan = meterPricePlanMap[smartMeterId];
  validatePricePlanForSmartMeterId(pricePlan);
  const pricePerKWHInPounds = pricePlan.rate;
  let readings;
  if (smartMeterId === "smart-meter-example") {
    readings = convertMockToReadings(meterReadingsMock);
  } else {
    readings = getReadings(smartMeterId);
  }
  storeReadings(readingsStoreURL, readings, smartMeterId);
  return { energyCost: calculateEnergyCost(readings, pricePerKWHInPounds) };
};

module.exports = { calculateEnergyCostBySmartMeterId };
