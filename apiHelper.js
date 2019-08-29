/*
 * API Logic
 *
 */

const request = require('request');
const fs = require('fs');

const accuweatherApiKey = 'Q7FmHNhcT9oLhLirPaixbz5WFmgThFEz';

const helpers = {};

// Retrieve data from Accuweather API based off locationKey input from HTML form
helpers.retrieveFromAcuuweather = (locationKey, callback) => {
  const apiUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${accuweatherApiKey}`

  // Add gzip compression in header to lower data transfer
  const options = {
    url: apiUrl,
    gzip: true
  }

  request(options, (err, res, body) => {
    if (!err && body.length > 0) {
      // Saving responses in case out of API calls
      let stream = fs.createWriteStream('data.txt', {flags: 'a'});
      stream.write(body + '\n');
      stream.end();

      let data = JSON.parse(body);

      // Check response body and handle errors accordingly
      if (data.Code === 'ServiceUnavailable') {
        callback('Error: Reached max API calls')
      } else if (parseInt(data.Code) >= 400) {
        callback('Error: Invalid locationKey Input or Server Error');
      } else {
        callback(false, data);
      }

    } else {
      callback(err);
    }
  });

}

helpers.sendDataToBigPanda = (data, locationKey, callback) => {
  const locationData = data[0];
  const condition = typeof locationData.WeatherText === 'string' && locationData.WeatherText.length > 0 ? locationData.WeatherText.toLowerCase() : '';
  const bigPandaApiUrl = 'https://api.bigpanda.io/data/v2/alerts';

  // URI, headers, and payload to send to bigpanda
  const options = {
    uri: bigPandaApiUrl,
    headers: {
      'Authorization': 'Bearer 018c12fa7ff28fd77ebde24d3e67eef0',
      'Content-Type': 'application/json'
    },
    json: {
      "app_key": "81ee1d3395d6de759710e882532f41c2",
      "status": "warning",
      "application": "accuweather",
      "check": "Weather Check",
      "incident_identifier": String(locationKey),
      "timestamp": Date.now(),
      "description": String(locationData.Temperature.Imperial.Value) + "F",
      "condition": String(locationData.WeatherText),
      "link": String(locationData.Link)
    }
  }
  
  // Set accuweather alert weather conditions
  const criticalConditions = ['rain', 'snow', 'ice', 'wind gust', 'sustained wind', 'thunderstorm'];

  // If location condition is in criticalConditions array, set the bigpanda json status to critical
  if (criticalConditions.includes(condition)) {
    options.json.status = "critical"
  }
  
  // Post payload to bigpanda
  request.post(options, (err, res, body) => {
    if (!err) {
      console.log(body);
      callback(false);
    } else {
      callback('Error: Couldn\'t post data to bigpanda');
    }
  });

}

module.exports = helpers;
