const { meters } = require("../meters/meters");
const { getReadings } = require("../readings/readings");
const {
  calculateEnergyCostBySmartMeterId,
} = require("../usage/usage-controller");

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
});
