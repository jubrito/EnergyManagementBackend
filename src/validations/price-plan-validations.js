const { HTTP_STATUS } = require("../constants/http-status");

const validatePricePlanForSmartMeterId = (pricePlan, smartMeterId) => {
  if (pricePlan == null) {
    return {
      errorMessage: `No price plan found for the smart meter id '${smartMeterId}'`,
      status: HTTP_STATUS.NOT_FOUND,
    };
  }
};

module.exports = { validatePricePlanForSmartMeterId };
