const express = require("express");
const { readings } = require("./readings/readings");
const { readingsData } = require("./readings/readings.data");
const { read, store } = require("./readings/readings-controller");
const { recommend, compare } = require("./price-plans/price-plans-controller");
const {
  timeElapsedInDecimalHours,
  average,
  usageCost,
  usage,
} = require("./usage/usage");
const { meterReadingsMock } = require("./mocks/meter-readings");

const app = express();
app.use(express.json());

const { getReadings, setReadings } = readings(readingsData);

app.get("/readings/read/:smartMeterId", (req, res) => {
  res.send(read(getReadings, req));
});

app.post("/readings/store", (req, res) => {
  res.send(store(setReadings, req));
});

app.get("/price-plans/recommend/:smartMeterId", (req, res) => {
  res.send(recommend(getReadings, req));
});

app.get("/price-plans/compare-all/:smartMeterId", (req, res) => {
  res.send(compare(getReadings, req));
});

const convertMockToReadings = (mock) => {
  const newReadingsArray = mock.map((item) => {
    const date = new Date(item.iso8601Timestamp);
    const time = date.getTime(); // Convert to seconds since epoch
    return {
      time,
      reading: item.powerReadingInKW,
    };
  });
  return newReadingsArray;
};

// app.get('/usage/:smartMeterId&:pricePlan', async (req, res) => {
app.get("/usage/:smartMeterId", async (req, res) => {
  const smartMeterId = req.params.smartMeterId;
  // const readings = read(getReadings, req);
  const readings = getReadings(smartMeterId);
  console.log("readings", readings);
  // const readings = convertMockToReadings(meterReadingsMock);
  const avarageReadingInKW = average(readings);
  const durationInHours = timeElapsedInDecimalHours(readings);
  const energyConsumedInKWPerHour = avarageReadingInKW * durationInHours;
  const pricePerKWHInPounds = 0.29;
  const cost = (energyConsumedInKWPerHour * pricePerKWHInPounds).toFixed(2);
  console.log("usageCost", usageCost(readings, 0.29));
  console.log("usage", usage(readings));
  console.log("avarageReadingInKW", avarageReadingInKW);
  console.log("durationInHours", durationInHours);
  console.log("energyConsumedInKWPerHour", energyConsumedInKWPerHour);
  res.send(cost);
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log(`🚀 app listening on port ${port}`);
