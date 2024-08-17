const { meters } = require("../meters/meters");

const generateSingle = () => {
  const startTime = 1607686125; // Friday, 11 December 2020 11:28:45 GMT+00:00
  const hour = 3600;
  const readingsLength = Math.ceil(Math.random() * 20);

  return [...new Array(readingsLength)].map((reading, index) => ({
    time: startTime - index * hour,
    reading: Math.random() * 2,
  }));
};

const generateAllMeters = () => {
  const readings = {};

  for (const key in meters) {
    if (meters.hasOwnProperty(key)) {
      readings[meters[key]] = generateSingle();
    }
  }

  return readings;
};

const readingsData = generateAllMeters();

const storeReadings = (readingsStoreURL, readings, smartMeterId) => {
  fetch(readingsStoreURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      smartMeterId,
      electricityReadings: readings,
    }),
  })
    .then((result) => {
      console.log("Readings stored successfuly");
      // console.log("Data: ", result);
    })
    .catch((error) => {
      console.log("There was an error when trying to store readings");
      console.log("Error: ", error);
    });
};

module.exports = { readingsData, storeReadings };
