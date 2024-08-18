const { meters } = require("../meters/meters");
const { pricePlans, pricePlanNames } = require("./price-plans");
const { readings } = require("../readings/readings");
const { compare, recommend } = require("./price-plans-controller");
const {
  getPricePlanForSmartMeterId,
} = require("../price-plans/price-plans-controller");
const { HTTP_STATUS_CODES } = require("../constants/http-status");

describe("price plans", () => {
  it("should compare usage cost for all price plans", () => {
    const { getReadings } = readings({
      [meters.METER0]: [
        { time: 1607686125, reading: 0.26785 },
        { time: 1607599724, reading: 0.26785 },
        { time: 1607513324, reading: 0.26785 },
      ],
    });

    const expected = {
      pricePlanComparisons: [
        {
          [pricePlanNames.PRICEPLAN0]:
            (0.26785 / 48) * pricePlans[pricePlanNames.PRICEPLAN0].rate,
        },
        {
          [pricePlanNames.PRICEPLAN1]:
            (0.26785 / 48) * pricePlans[pricePlanNames.PRICEPLAN1].rate,
        },
        {
          [pricePlanNames.PRICEPLAN2]:
            (0.26785 / 48) * pricePlans[pricePlanNames.PRICEPLAN2].rate,
        },
        {
          [pricePlanNames.PRICEPLAN_ATTACHED_TO_SMART_METER_ID]:
            (0.26785 / 48) *
            pricePlans[pricePlanNames.PRICEPLAN_ATTACHED_TO_SMART_METER_ID]
              .rate,
        },
        {
          [pricePlanNames.PRICEPLAN_NOT_ATTACHED_TO_SMART_METER_ID]:
            (0.26785 / 48) *
            pricePlans[pricePlanNames.PRICEPLAN_NOT_ATTACHED_TO_SMART_METER_ID]
              .rate,
        },
        {
          [pricePlanNames.PRICEPLAN_FOR_METER_WITH_TWO_READINGS_FOR_EACH_WEEK_DAY]:
            (0.26785 / 48) *
            pricePlans[
              pricePlanNames
                .PRICEPLAN_FOR_METER_WITH_TWO_READINGS_FOR_EACH_WEEK_DAY
            ].rate,
        },
      ],
      smartMeterId: meters.METER0,
    };

    const recommendation = compare(getReadings, {
      params: {
        smartMeterId: meters.METER0,
      },
      query: {},
    });

    expect(recommendation).toEqual(expected);
  });

  it("should recommend usage cost for all price plans by ordering from cheapest to expensive", () => {
    const { getReadings } = readings({
      [meters.METER0]: [
        { time: 1607686125, reading: 0.26785 },
        { time: 1607599724, reading: 0.26785 },
        { time: 1607513324, reading: 0.26785 },
      ],
    });

    const expected = [
      {
        [pricePlanNames.PRICEPLAN_ATTACHED_TO_SMART_METER_ID]:
          (0.26785 / 48) *
          pricePlans[pricePlanNames.PRICEPLAN_ATTACHED_TO_SMART_METER_ID].rate,
      },
      {
        [pricePlanNames.PRICEPLAN2]:
          (0.26785 / 48) * pricePlans[pricePlanNames.PRICEPLAN2].rate,
      },
      {
        [pricePlanNames.PRICEPLAN_NOT_ATTACHED_TO_SMART_METER_ID]:
          (0.26785 / 48) *
          pricePlans[pricePlanNames.PRICEPLAN_NOT_ATTACHED_TO_SMART_METER_ID]
            .rate,
      },
      {
        [pricePlanNames.PRICEPLAN1]:
          (0.26785 / 48) * pricePlans[pricePlanNames.PRICEPLAN1].rate,
      },
      {
        [pricePlanNames.PRICEPLAN0]:
          (0.26785 / 48) * pricePlans[pricePlanNames.PRICEPLAN0].rate,
      },
      {
        [pricePlanNames.PRICEPLAN_FOR_METER_WITH_TWO_READINGS_FOR_EACH_WEEK_DAY]:
          (0.26785 / 48) *
          pricePlans[
            pricePlanNames
              .PRICEPLAN_FOR_METER_WITH_TWO_READINGS_FOR_EACH_WEEK_DAY
          ].rate,
      },
    ];

    const recommendation = recommend(getReadings, {
      params: {
        smartMeterId: meters.METER0,
      },
      query: {},
    });

    expect(recommendation).toEqual(expected);
  });

  it("should limit recommendation", () => {
    const { getReadings } = readings({
      [meters.METER0]: [
        { time: 1607686125, reading: 0.26785 },
        { time: 1607599724, reading: 0.26785 },
        { time: 1607513324, reading: 0.26785 },
      ],
    });

    const expected = [
      {
        [pricePlanNames.PRICEPLAN_ATTACHED_TO_SMART_METER_ID]:
          (0.26785 / 48) *
          pricePlans[pricePlanNames.PRICEPLAN_ATTACHED_TO_SMART_METER_ID].rate,
      },
      {
        [pricePlanNames.PRICEPLAN2]:
          (0.26785 / 48) * pricePlans[pricePlanNames.PRICEPLAN2].rate,
      },
    ];

    const recommendation = recommend(getReadings, {
      params: {
        smartMeterId: meters.METER0,
      },
      query: {
        limit: 2,
      },
    });

    expect(recommendation).toEqual(expected);
  });
  it("should return a 404 status code, an error message and no price plan if smart meter id does not have a price plan attached to it", () => {
    const smartMeterId = meters.METER_WITHOUT_PRICE_PLAN;
    const validationResult = getPricePlanForSmartMeterId(smartMeterId);
    expect(validationResult).toStrictEqual({
      statusCode: HTTP_STATUS_CODES.NOT_FOUND,
      message: `No price plan found for the smart meter id '${smartMeterId}'`,
      pricePlan: undefined,
    });
  });
  it("should return a 200 status code and an success message if smart meter id does not have a price plan attached to it", () => {
    const smartMeterId = meters.METER_WITH_PRICE_PLAN;
    const validationResult = getPricePlanForSmartMeterId(smartMeterId);
    expect(validationResult).toStrictEqual({
      statusCode: HTTP_STATUS_CODES.OK,
      message: `A price plan was found for the smart meter id '${smartMeterId}'`,
      pricePlan:
        pricePlans[pricePlanNames.PRICEPLAN_ATTACHED_TO_SMART_METER_ID],
    });
  });
});
