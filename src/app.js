const express = require("express");
const { readings } = require("./readings/readings");
const { readingsData } = require("./readings/readings.data");
const { read, store } = require("./readings/readings-controller");
const { recommend, compare } = require("./price-plans/price-plans-controller");
const {
  timeElapsedInDecimalHours,
  energyConsumedInKWPerHour,
  energyCost,
  calculateEnergyCost,
} = require("./usage/usage");
const { convertMockToReadings } = require("./utils/convertMockToReadings");
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

// app.get('/usage/:smartMeterId&:pricePlan', async (req, res) => {
app.get("/usage/:smartMeterId", async (req, res) => {
  const smartMeterId = req.params.smartMeterId;
  let readings = getReadings(smartMeterId);
  const shouldUseMock = true;
  if (shouldUseMock) {
    readings = convertMockToReadings(meterReadingsMock);
  }
  const data = {
    smartMeterId,
    electricityReadings: readings,
  };
  fetch("http://localhost:8080/readings/store", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((result) => {
      console.log("Readings stored successfuly");
      // console.log("Data: ", result);
    })
    .catch((error) => {
      console.log("There was an error when trying to store readings");
      console.log("Error: ", error);
    });
  const energyCost = calculateEnergyCost(readings);
  res.send({ energyCost: energyCost });
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log(`🚀 app listening on port ${port}`);
