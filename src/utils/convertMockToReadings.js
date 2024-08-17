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

module.exports = {
  convertMockToReadings,
};
