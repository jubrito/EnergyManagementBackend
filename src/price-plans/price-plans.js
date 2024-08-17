const pricePlanNames = {
  PRICEPLAN0: "price-plan-0",
  PRICEPLAN1: "price-plan-1",
  PRICEPLAN2: "price-plan-2",
  PRICEPLAN_ATTACHED_TO_SMART_METER_ID: "price-plan-attached-to-smart-meter-id",
  PRICEPLAN_NOT_ATTACHED_TO_SMART_METER_ID:
    "price-plan-not-attached-to-smart-meter-id",
};

const supplierNames = {
  DR_EVILS_DARK_ENERGY_ENERGY_SUPPLIER: "Dr Evil's Dark Energy",
  THE_GREEN_ECO_ENERGY_SUPPLIER: "The Green Eco",
  POWER_FOR_EVERYONE_ENERGY_SUPPLIER: "Power for Everyone",
  SUPLIER_PRICE_PLAN_ATTACHED_TO_SMART_METER_ID:
    "Supplier connected to spreadsheet example where price plan is attached to smart meter id",
  SUPLIER_PRICE_PLAN_NOT_ATTACHED_TO_SMART_METER_ID:
    "Supplier connected to spreadsheet example where price plan is not attached to smart meter id",
};

const pricePlans = {
  [pricePlanNames.PRICEPLAN0]: {
    supplier: supplierNames.DR_EVILS_DARK_ENERGY_ENERGY_SUPPLIER,
    rate: 10,
  },
  [pricePlanNames.PRICEPLAN1]: {
    supplier: supplierNames.POWER_FOR_EVERYONE_ENERGY_SUPPLIER,
    rate: 2,
  },
  [pricePlanNames.PRICEPLAN2]: {
    supplier: supplierNames.THE_GREEN_ECO_ENERGY_SUPPLIER,
    rate: 1,
  },
  [pricePlanNames.PRICEPLAN_ATTACHED_TO_SMART_METER_ID]: {
    supplier: supplierNames.SUPLIER_PRICE_PLAN_ATTACHED_TO_SMART_METER_ID,
    rate: 0.29,
  },
  [pricePlanNames.PRICEPLAN_NOT_ATTACHED_TO_SMART_METER_ID]: {
    supplier: supplierNames.SUPLIER_PRICE_PLAN_NOT_ATTACHED_TO_SMART_METER_ID,
    rate: 1.01,
  },
};

module.exports = { pricePlans, pricePlanNames };
