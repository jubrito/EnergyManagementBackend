const { calculateEnergyCost, usageCost } = require("./usage");
const { convertMockToReadings } = require("../utils/convertMockToReadings");
const { meterReadingsMock } = require("../mocks/meter-readings");
const { meters } = require("../meters/meters");
const {
  storeReadings,
  generateTwoReadingsForEachWeekDay,
  getReadingsByDayOfTheWeek,
} = require("../readings/readings.data");
const {
  getPricePlanForSmartMeterId,
} = require("../price-plans/price-plans-controller");
const { HTTP_STATUS_CODES } = require("../constants/http-status");

const calculateEnergyCostBySmartMeterId = (getReadings, req) => {
  const readingsStoreURL = "http://localhost:8080/readings/store";
  const smartMeterId = req.params.smartMeterId;
  const { statusCode, message, pricePlan } =
    getPricePlanForSmartMeterId(smartMeterId);
  if (statusCode === HTTP_STATUS_CODES.NOT_FOUND) {
    return {
      errorMessage: message,
      statusCode,
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

const calculateUsageCostBySmartMeterIdForEachWeekDay = (getReadings, req) => {
  const smartMeterId = req.params.smartMeterId;
  const { statusCode, message, pricePlan } =
    getPricePlanForSmartMeterId(smartMeterId);
  if (statusCode === HTTP_STATUS_CODES.NOT_FOUND) {
    return {
      errorMessage: message,
      statusCode,
    };
  }
  const pricePerKWHInPounds = pricePlan.rate;

  let readings;
  if (smartMeterId === meters.METER_WITH_TWO_READINGS_FOR_EACH_WEEK_DAY) {
    readings = generateTwoReadingsForEachWeekDay();
  } else {
    readings = getReadings(smartMeterId);
  }
  const readingsByDayOfTheWeek = getReadingsByDayOfTheWeek(readings);
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const usageCostByDayOfTheWeek = daysOfWeek.reduce((acc, day) => {
    acc[day] = usageCost(readingsByDayOfTheWeek[day], pricePerKWHInPounds) || 0;
    return acc;
  }, {});
  return usageCostByDayOfTheWeek;
};

module.exports = {
  calculateEnergyCostBySmartMeterId,
  calculateUsageCostBySmartMeterIdForEachWeekDay,
};
