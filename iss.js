const request = require("request");
const IPURL = "https://api.ipify.org?format=json";
const COORDURL = "https://ipvigilante.com/8.8.8.8";
const FLYOVERTIMES = "http://api.open-notify.org/iss-pass.json?lat=LAT&lon=LON";

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = callback => {
  // use request to fetch IP address from JSON API
  request(IPURL, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${
        response.statusCode
      } when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ipAddress = JSON.parse(body).ip;
    callback(null, ipAddress);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(COORDURL, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${
        response.statusCode
      } when fetching coordinates. Reponse: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body).data;

    callback(null, { latitude, longitude });
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyOverTimes = (coords, callback) => {
  let FLYURL = `http://api.open-notify.org/iss-pass.json?lat=${
    coords.latitude
  }&lon=${coords.longitude}`;
  request(FLYURL, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${
        response.statusCode
      } when fetching ISS pass times. Reponse: ${body}`;
      callback(Error(msg, null));
      return;
    }

    const ISSFlyOverTimes = JSON.parse(body).response;
    callback(null, ISSFlyOverTimes);
  });
};

// iss.js

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = callback => {
  let exampleIp = "66.207.199.23";
  fetchMyIP((error, ip) => {
    if (error) {
      callback("It didn't work", error);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        callback("It didn't work", error);
      }
      fetchISSFlyOverTimes(coords, (error, flyOverTimes) => {
        if (error) {
          callback("It didn't work", error);
        }
        let result = flyOverTimes.map(ele => {
          const datetime = new Date(0);
          datetime.setUTCSeconds(ele.risetime);
          const duration = ele.duration;
          return `Next pass at ${datetime} for ${duration} seconds!`;
        });
        callback(null, result);
      });
    });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};
