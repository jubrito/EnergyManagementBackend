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

const storeReadings = (readings, smartMeterId) => {
  const readingsStoreURL = "http://localhost:8080/readings/store";
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

const generateTimestampForDay = (dayOfWeek, hour = 12) => {
  const now = new Date();
  const currentDay = now.getDay();
  const diff = dayOfWeek - currentDay;
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + diff);
  targetDate.setHours(hour, 0, 0, 0);
  return targetDate.getTime();
};

const generateTwoReadingsForEachWeekDay = () => {
  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // Sunday to Saturday
  const readings = [];

  daysOfWeek.forEach((day) => {
    for (let i = 0; i < 2; i++) {
      // 2 readings per day
      readings.push({
        time: generateTimestampForDay(day, 12 + i), // Different hour for each reading
        reading: Math.random() * 2,
      });
    }
  });

  return readings;
};

const getReadingsByDayOfTheWeek = (readings) => {
  const readingsByDayOfTheWeek = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };
  readings.map((reading) => {
    const timestamp = reading.time;
    const day = new Date(timestamp).getDay();
    switch (day) {
      case 0:
        readingsByDayOfTheWeek.sunday.push(reading);
        break;
      case 1:
        readingsByDayOfTheWeek.monday.push(reading);
        break;
      case 2:
        readingsByDayOfTheWeek.tuesday.push(reading);
        break;
      case 3:
        readingsByDayOfTheWeek.wednesday.push(reading);
        break;
      case 4:
        readingsByDayOfTheWeek.thursday.push(reading);
        break;
      case 5:
        readingsByDayOfTheWeek.friday.push(reading);
        break;
      case 6:
        readingsByDayOfTheWeek.saturday.push(reading);
        break;
      default:
        break;
    }
  });
  return readingsByDayOfTheWeek;
};

module.exports = {
  readingsData,
  storeReadings,
  generateTwoReadingsForEachWeekDay,
  getReadingsByDayOfTheWeek,
};
