const { meters, meterPricePlanMap } = require("../meters/meters");
const { pricePlanNames, pricePlans } = require("../price-plans/price-plans");
const { readings } = require("../readings/readings");
const { convertMockToReadings } = require("../utils/convertMockToReadings");
const { meterReadingsMock } = require("../mocks/meter-readings");
const {
  average,
  timeElapsedInWholeHours,
  calculateEnergyCost,
  usage,
  usageCost,
  usageForAllPricePlans,
} = require("./usage");

describe("usage", () => {
  it("should average all readings for a meter", () => {
    const { getReadings } = readings({
      [meters.METER0]: [
        { time: 923874692387, reading: 0.26785 },
        { time: 923874692387, reading: 0.26785 },
        { time: 923874692387, reading: 0.26785 },
      ],
    });

    const averageMeter0 = average(getReadings(meters.METER0));

    expect(averageMeter0).toBe(0.26785);
  });

  it("should get time elapsed in hours for all readings for a meter", () => {
    const { getReadings } = readings({
      [meters.METER0]: [
        { time: 1607686135, reading: 0.26785 },
        { time: 1607599724, reading: 0.26785 },
        { time: 1607512024, reading: 0.26785 },
      ],
    });

    const timeElapsedMeter0 = timeElapsedInWholeHours(
      getReadings(meters.METER0)
    );

    expect(timeElapsedMeter0).toBe(48);
  });

  it("should get usage for all readings for a meter", () => {
    const { getReadings } = readings({
      [meters.METER0]: [
        { time: 1607686125, reading: 0.26785 },
        { time: 1607599724, reading: 0.26785 },
        { time: 1607513324, reading: 0.26785 },
      ],
    });

    const usageMeter0 = usage(getReadings(meters.METER0));

    expect(usageMeter0).toBe(0.26785 / 48);
  });

  it("should get usage cost for all readings for a meter", () => {
    const { getReadings } = readings({
      [meters.METER2]: [
        { time: 1607686125, reading: 0.26785 },
        { time: 1607599724, reading: 0.26785 },
        { time: 1607513324, reading: 0.26785 },
      ],
    });

    const rate = meterPricePlanMap[meters.METER2].rate;
    const usageCostForMeter = usageCost(getReadings(meters.METER2), rate);

    expect(usageCostForMeter).toBe((0.26785 / 48) * 1);
  });

  it("should get usage cost for all readings for all price plans", () => {
    const { getReadings } = readings({
      [meters.METER2]: [
        { time: 1607686125, reading: 0.26785 },
        { time: 1607599724, reading: 0.26785 },
        { time: 1607513324, reading: 0.26785 },
      ],
    });

    const expected = [
      {
        [pricePlanNames.PRICEPLAN0]: (0.26785 / 48) * 10,
      },
      {
        [pricePlanNames.PRICEPLAN1]: (0.26785 / 48) * 2,
      },
      {
        [pricePlanNames.PRICEPLAN2]: (0.26785 / 48) * 1,
      },
      {
        [pricePlanNames.PRICEPLAN_ATTACHED_TO_SMART_METER_ID]:
          (0.26785 / 48) * 0.29,
      },
      {
        [pricePlanNames.PRICEPLAN_NOT_ATTACHED_TO_SMART_METER_ID]:
          (0.26785 / 48) * 1.01,
      },
    ];

    const usageForAllPricePlansArray = usageForAllPricePlans(
      pricePlans,
      getReadings(meters.METER2)
    );

    expect(usageForAllPricePlansArray).toEqual(expected);
  });

  it("should calculate energy cost for a smart meter id with a plan attached to it", () => {
    const readings = convertMockToReadings(meterReadingsMock);
    const pricePerKWHInPounds =
      meterPricePlanMap[meters.METER_WITH_PRICE_PLAN].rate;
    const energyCost = calculateEnergyCost(readings, pricePerKWHInPounds);
    expect(energyCost).toBe("45.10");
  });
});
