exports.generateRandomScore = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.parseJson = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.log('error parsing json ', error);
    return data;
  }
};
