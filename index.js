// // index.js
// const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require("./iss");

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }
//   return ip;
//   // console.log("It worked! Returned IP:", ip);
// });

// const exampleIp = "66.207.199.23"

// fetchCoordsByIP(exampleIp, (error, coords) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   return coords;
//   // console.log('It worked! Returned Coords:' , coords);
// });

// const exampleCoords = { latitude: '49.27670', longitude: '-123.13000' };

// fetchISSFlyOverTimes(exampleCoords, (error, flyOverTimes) => {
//   if (error) {
//     console.log(`It didn't work! ${error}`);
//     return;
//   }

//   return flyOverTimes;
//   // console.log(`It worked! Returned ISSFlyOverTimes: ${flyOverTimes}`);

// });

const { nextISSTimesForMyLocation } = require("./iss");

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  passTimes.forEach(x => console.log(x));
});
