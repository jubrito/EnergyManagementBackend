const validatePricePlanForSmartMeterId = (pricePlan) => {
  if (pricePlan == null) {
    res.status(404).send({
      error: `No price plan found for the smart meter id '${smartMeterId}'`,
    });
    return;
  }
};

module.exports = { validatePricePlanForSmartMeterId };
