const average = (readings) => {
  return (
    readings.reduce((prev, next) => prev + next.reading, 0) / readings.length
  );
};

const timeElapsedInWholeHours = (readings) => {
  readings.sort((a, b) => a.time - b.time);
  const seconds = readings[readings.length - 1].time - readings[0].time;
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

const usage = (readings) => {
  return average(readings) / timeElapsedInWholeHours(readings);
};

const usageCost = (readings, rate) => {
  return usage(readings) * rate;
};

const usageForAllPricePlans = (pricePlans, readings) => {
  return Object.entries(pricePlans).map(([key, value]) => {
    return {
      [key]: usageCost(readings, value.rate),
    };
  });
};

module.exports = {
  average,
  timeElapsedInWholeHours,
  timeElapsedInDecimalHours,
  usage,
  usageCost,
  usageForAllPricePlans,
};
