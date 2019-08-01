// index2.js
const { nextISSTimesForMyLocation } = require("./iss_promised");

// see index.js for printPassTimes
// copy it from there, or better yet, moduralize and require it in both files

const printPassTimes = data => {
  data
    .map(ele => {
      const datetime = new Date(0);
      datetime.setUTCSeconds(ele.risetime);
      const duration = ele.duration;
      return `Next pass at ${datetime} for ${duration} seconds!`;
    })
    .forEach(x => console.log(x));
};

// Call
nextISSTimesForMyLocation()
  .then(passTimes => {
    printPassTimes(passTimes);
  })
  .catch(error => {
    console.log("It didn't work ", error);
  });
