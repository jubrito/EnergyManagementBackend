const { pricePlans, pricePlanNames } = require("../price-plans/price-plans");

const meters = {
  METER0: "smart-meter-0",
  METER1: "smart-meter-1",
  METER2: "smart-meter-2",
  METER3: "smart-meter-3",
  METER4: "smart-meter-4",
  METER_WITH_PRICE_PLAN: "smart-meter-with-price-plan",
  METER_WITHOUT_PRICE_PLAN: "smart-meter-without-price-plan",
  METER_WITH_TWO_READINGS_FOR_EACH_WEEK_DAY:
    "smart-meter-with-two-readings-for-each-day-of-the-week",
};

const meterPricePlanMap = {
  [meters.METER0]: pricePlans[pricePlanNames.PRICEPLAN0],
  [meters.METER1]: pricePlans[pricePlanNames.PRICEPLAN1],
  [meters.METER2]: pricePlans[pricePlanNames.PRICEPLAN2],
  [meters.METER_WITH_PRICE_PLAN]:
    pricePlans[pricePlanNames.PRICEPLAN_ATTACHED_TO_SMART_METER_ID],
  [meters.METER_WITH_TWO_READINGS_FOR_EACH_WEEK_DAY]:
    pricePlans[
      pricePlanNames.PRICEPLAN_FOR_METER_WITH_TWO_READINGS_FOR_EACH_WEEK_DAY
    ],
};

module.exports = { meterPricePlanMap, meters };
