const { HTTP_STATUS_CODES } = require("../constants/http-status");

const validatePricePlanForSmartMeterId = (pricePlan, smartMeterId) => {
  if (pricePlan == null) {
    return {
      message: `No price plan found for the smart meter id '${smartMeterId}'`,
      statusCode: HTTP_STATUS_CODES.NOT_FOUND,
    };
  }
  return {
    message: `A price plan was found for the smart meter id '${smartMeterId}'`,
    statusCode: 200,
  };
};

module.exports = { validatePricePlanForSmartMeterId };
