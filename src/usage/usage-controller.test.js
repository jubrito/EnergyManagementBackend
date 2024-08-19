const { meters } = require("../meters/meters");
const { pricePlans, pricePlanNames } = require("../price-plans/price-plans");
const { getReadings, readings } = require("../readings/readings");
const { convertMockToReadings } = require("../utils/convertMockToReadings");
const { meterReadingsMock } = require("../mocks/meter-readings");
const { getReadingsByDayOfTheWeek } = require("../readings/readings.data");
const {
  calculateEnergyCostBySmartMeterId,
  calculateUsageCostBySmartMeterIdForEachWeekDay,
} = require("../usage/usage-controller");
const { usageCost } = require("../usage/usage");

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(),
  })
);

describe("usage-controller", () => {
  it("should calculate energy cost by smart meter id when it has a price plan attached to it", () => {
    const req = {
      params: {
        smartMeterId: meters.METER_WITH_PRICE_PLAN,
      },
    };
    console.log(
      "convertMockToReadings(meterReadingsMock)",
      convertMockToReadings(meterReadingsMock)
    );
    const { getReadings } = readings({
      [meters.METER_WITH_PRICE_PLAN]: convertMockToReadings(meterReadingsMock),
    });
    const { energyCost } = calculateEnergyCostBySmartMeterId(getReadings, req);
    expect(energyCost).toBe("45.10");
  });
  it("should display error message and status code 404 when trying to calculate energy cost by smart meter id when it does not have a price plan attached to it", () => {
    const req = {
      params: {
        smartMeterId: meters.METER_WITHOUT_PRICE_PLAN,
      },
    };
    const { errorMessage, statusCode } = calculateEnergyCostBySmartMeterId(
      getReadings,
      req
    );
    expect(errorMessage).toBe(
      "No price plan found for the smart meter id 'smart-meter-without-price-plan'"
    );
    expect(statusCode).toBe(404);
  });
  it("should calculate energy cost by smart meter id when there is only when day of the week and it has a price plan attached to it", () => {
    const req = {
      params: {
        smartMeterId: meters.METER0,
      },
    };
    const readingsWithOnlyOneDayOfTheWeek = [
      { time: 1723993200000, reading: 1 }, // Sunday
      { time: 1723996800000, reading: 2 }, // Sunday
    ];
    const { getReadings } = readings({
      [meters.METER0]: readingsWithOnlyOneDayOfTheWeek,
    });
    const { rankedAndOrderedUsageCosts } =
      calculateUsageCostBySmartMeterIdForEachWeekDay(getReadings, req);
    const usageCostResult = usageCost(
      readingsWithOnlyOneDayOfTheWeek,
      pricePlans[pricePlanNames.PRICEPLAN0].rate
    );
    expect(rankedAndOrderedUsageCosts).toStrictEqual({
      sunday: {
        rank: 0,
        usageCost: usageCostResult,
      },
    });
  });
  it("should calculate energy cost by smart meter for each week day id when it has a price plan attached to it", () => {
    const req = {
      params: {
        smartMeterId: meters.METER0,
      },
    };
    const twoReadingsForEachWeekDay = [
      { time: 1723993200000, reading: 14 }, // Sunday
      { time: 1723996800000, reading: 13 }, // Sunday
      { time: 1724079600000, reading: 12 }, // Monday
      { time: 1724083200000, reading: 11 }, // Monday
      { time: 1724166000000, reading: 10 }, // Tuesday
      { time: 1724169600000, reading: 9 }, // Tuesday
      { time: 1724252400000, reading: 8 }, // Wednesday
      { time: 1724256000000, reading: 7 }, // Wednesday
      { time: 1724338800000, reading: 6 }, // Thursday
      { time: 1724342400000, reading: 5 }, // Thursday
      { time: 1724425200000, reading: 4 }, // Friday
      { time: 1724428800000, reading: 3 }, // Friday
      { time: 1724511600000, reading: 2 }, // Saturday
      { time: 1724515200000, reading: 1 }, // Saturday
    ];
    const { getReadings } = readings({
      [meters.METER0]: twoReadingsForEachWeekDay,
    });
    const readingsByDayOfTheWeek = getReadingsByDayOfTheWeek(
      twoReadingsForEachWeekDay
    );
    const { rankedAndOrderedUsageCosts } =
      calculateUsageCostBySmartMeterIdForEachWeekDay(getReadings, req);
    expect(rankedAndOrderedUsageCosts).toStrictEqual({
      saturday: {
        usageCost: usageCost(
          readingsByDayOfTheWeek.saturday,
          pricePlans[pricePlanNames.PRICEPLAN0].rate
        ),
        rank: 0,
      },
      friday: {
        usageCost: usageCost(
          readingsByDayOfTheWeek.friday,
          pricePlans[pricePlanNames.PRICEPLAN0].rate
        ),
        rank: 1,
      },
      thursday: {
        usageCost: usageCost(
          readingsByDayOfTheWeek.thursday,
          pricePlans[pricePlanNames.PRICEPLAN0].rate
        ),
        rank: 2,
      },
      wednesday: {
        usageCost: usageCost(
          readingsByDayOfTheWeek.wednesday,
          pricePlans[pricePlanNames.PRICEPLAN0].rate
        ),
        rank: 3,
      },
      tuesday: {
        usageCost: usageCost(
          readingsByDayOfTheWeek.tuesday,
          pricePlans[pricePlanNames.PRICEPLAN0].rate
        ),
        rank: 4,
      },
      monday: {
        usageCost: usageCost(
          readingsByDayOfTheWeek.monday,
          pricePlans[pricePlanNames.PRICEPLAN0].rate
        ),
        rank: 5,
      },
      sunday: {
        usageCost: usageCost(
          readingsByDayOfTheWeek.sunday,
          pricePlans[pricePlanNames.PRICEPLAN0].rate
        ),
        rank: 6,
      },
    });
  });
  it("should display error message and status code 404 when trying to calculate energy cost by smart meter id for each week day when it does not have a price plan attached to it", () => {
    const req = {
      params: {
        smartMeterId: meters.METER_WITHOUT_PRICE_PLAN,
      },
    };
    const { errorMessage, statusCode } =
      calculateUsageCostBySmartMeterIdForEachWeekDay(getReadings, req);
    expect(errorMessage).toBe(
      "No price plan found for the smart meter id 'smart-meter-without-price-plan'"
    );
    expect(statusCode).toBe(404);
  });
});
