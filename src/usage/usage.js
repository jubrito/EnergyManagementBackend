const average = (readings) => {
  return (
    readings.reduce((prev, next) => prev + next.reading, 0) / readings.length
  );
};

const timeElapsedInWholeHours = (readings) => {
  readings?.sort((a, b) => a.time - b.time);
  const seconds = readings[readings.length - 1]?.time - readings[0]?.time;
  const hours = Math.floor(seconds / 3600);
  return hours;
};

const timeElapsedInDecimalHours = (readings) => {
  readings.sort((a, b) => a.time - b.time);
  const seconds = readings[readings.length - 1].time - readings[0].time;
  const factor = 1000;
  const hours = Math.round((seconds / (1000 * 60 * 60)) * factor) / 1000;
  return hours.toFixed(3);
};

const usage = (readings) =>
  average(readings) / timeElapsedInWholeHours(readings);

const energyConsumedInKWPerHour = (readings) =>
  average(readings) * timeElapsedInDecimalHours(readings);

const usageCost = (readings, rate) => {
  if (readings?.length === 0) {
    return 0;
  }
  return usage(readings) * rate;
};

const energyCost = (energyConsumedInKWH, pricePerKWHInPounds) => {
  return (energyConsumedInKWH * pricePerKWHInPounds).toFixed(2);
};

const usageForAllPricePlans = (pricePlans, readings) =>
  Object.entries(pricePlans).map(([key, value]) => {
    return {
      [key]: usageCost(readings, value.rate),
    };
  });

const calculateEnergyCost = (readings, pricePerKWHInPounds) => {
  const energyConsumedInKWH = energyConsumedInKWPerHour(readings);
  return energyCost(energyConsumedInKWH, pricePerKWHInPounds);
};

const getRankedAndOrderedUsageCosts = (
  readingsByDayOfTheWeek,
  pricePerKWHInPounds
) => {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const usageCostByDayOfTheWeek = daysOfWeek.reduce((acc, day) => {
    if (readingsByDayOfTheWeek[day] != null) {
      acc[day] = usageCost(readingsByDayOfTheWeek[day], pricePerKWHInPounds);
    }
    return acc;
  }, {});
  const rankedAndOrderedUsageCosts = {};
  Object.values(usageCostByDayOfTheWeek)
    .sort((a, b) => a - b)
    .map((sortedUsageCost, rank) => {
      const sortedUsageCostKey = Object.keys(usageCostByDayOfTheWeek).find(
        (key) => usageCostByDayOfTheWeek[key] === sortedUsageCost
      );
      rankedAndOrderedUsageCosts[sortedUsageCostKey] = {
        usageCost: sortedUsageCost,
        rank,
      };
    });
  return rankedAndOrderedUsageCosts;
};

module.exports = {
  average,
  timeElapsedInWholeHours,
  timeElapsedInDecimalHours,
  usage,
  usageCost,
  usageForAllPricePlans,
  energyConsumedInKWPerHour,
  energyCost,
  calculateEnergyCost,
  getRankedAndOrderedUsageCosts,
};
