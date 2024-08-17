const { HTTP_STATUS_CODES } = require("../constants/http-status");

const validatePricePlanForSmartMeterId = (pricePlan, smartMeterId) => {
  if (pricePlan == null) {
    return {
      errorMessage: `No price plan found for the smart meter id '${smartMeterId}'`,
      statusCode: HTTP_STATUS_CODES.NOT_FOUND,
    };
  }
};

module.exports = { validatePricePlanForSmartMeterId };
