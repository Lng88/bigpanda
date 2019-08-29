const helpers = require('./../apiHelper');
const assert = require('assert');

const unit = {};
const testData = [
  {
    "LocalObservationDateTime":"2019-08-21T23:23:00-04:00",
    "EpochTime":1566444180,
    "WeatherText":"Thunderstorm",
    "WeatherIcon":33,
    "HasPrecipitation":true,
    "PrecipitationType":null,
    "IsDayTime":false,
    "Temperature": {
      "Metric": {
        "Value":25.6,
        "Unit":"C",
        "UnitType":17
      },
      "Imperial": {
        "Value":-5000,
        "Unit":"F",
        "UnitType":18
      }
    },
    "MobileLink":"http://m.accuweather.com/en/us/new-york-ny/10007/current-weather/349727?lang=en-us",
    "Link":"http://www.accuweather.com/en/us/new-york-ny/10007/current-weather/349727?lang=en-us"
  }
];

unit['helpers.sendDataToBigPanda post should not throw'] = (done) => {
  assert.doesNotThrow(() => {
    helpers.sendDataToBigPanda(testData, '123', (err) => {
      done();
    });
  });
}

module.exports = unit;
