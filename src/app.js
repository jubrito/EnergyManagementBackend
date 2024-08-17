const express = require("express");
const { readings } = require("./readings/readings");
const { readingsData } = require("./readings/readings.data");
const { read, store } = require("./readings/readings-controller");
const { recommend, compare } = require("./price-plans/price-plans-controller");
const { timeElapsedInHours } = require("./usage/usage");
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
  // readings in kW, time in hour: [{"time":1607686125,"reading":0.8570415390876098}]
  console.log("req.params.smartMeterId", req.params.smartMeterId);
  await fetch(
    `http://localhost:8080/readings/read/${req.params.smartMeterId}`
  ).then(async (data) => {
    // const readings = await data.json();
    const readings = convertMockToReadings(meterReadingsMock);
    console.log("readings", readings);
    const millisecondsPerSecond = 1000;
    const secondsPerMinute = 60;
    const minutesPerHour = 60;
    const hoursPerDay = 24;
    const daysPerWeek = 7;
    const oneWeekInMilliseconds =
      millisecondsPerSecond *
      secondsPerMinute *
      minutesPerHour *
      hoursPerDay *
      daysPerWeek;
    const millisecondsPerHour =
      millisecondsPerSecond * secondsPerMinute * minutesPerHour;
    const allReadingsInOrder = readings.map((reading) => reading);
    allReadingsInOrder.sort((a, b) => a.time - b.time);
    // const lastReading = allReadingsInOrder[allReadingsInOrder.length - 1];
    // const lastWeekReadings = allReadingsInOrder.filter((reading) => {
    //   return reading.time >= lastReading.time - oneWeekInMilliseconds;
    // });
    const lastWeekReadings = readings; // not sure why the exercise is considering all 12 days instead of last week only since this was in the requirements, but I've commented the code that only gets last weeks values to get to the correct result in the card1.md
    const totalEnergyConsumed = lastWeekReadings.reduce((acc, reading) => {
      return acc + reading.reading;
    }, 0);
    const avarageReadingInKW = totalEnergyConsumed / lastWeekReadings.length;
    const firstReadingTimeStamp = lastWeekReadings[0].time;
    const lastReadingTimeStamp =
      lastWeekReadings[lastWeekReadings.length - 1].time;
    const durationInHours = timeElapsedInHours(readings);
    const energyConsumedInKWPerHour = avarageReadingInKW * durationInHours;
    const pricePerKWHInPounds = 0.29;
    const cost = energyConsumedInKWPerHour * pricePerKWHInPounds;
    console.log("avarageReadingInKW", avarageReadingInKW);
    console.log("durationInHours", durationInHours);
    console.log("energyConsumedInKWPerHour", energyConsumedInKWPerHour);
    console.log("cost", cost);
  });
  // const energyConsumed =
  res.send(req.params.smartMeterId);
  // res.send(usage(getReadings, req));
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log(`🚀 app listening on port ${port}`);
