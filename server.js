/*
 * Server Logic
 *
 */

const express = require('express');
const bodyParser = require('body-parser');
const apiHelper = require('./apiHelper');

const app = express();
const PORT = 3000;

// Express middleware to read response body and serve static files in 'public' folder
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// When user enters in locationKey on frontend HTML file, it will submit a form post to this endpoint
app.post('/api/locationKey', (req, res) => {
  // Grab the locationKey from the request body
  let locationKey = req.body.locationKey;

  // Check if locationKey requirements are met
  if (typeof(locationKey) == 'string' && locationKey.length > 0) {
    // Retrieve weather condition based off locationKey input
    apiHelper.retrieveFromAcuuweather(locationKey, (err, data) => {
      if (!err) {
        // If no error, send current condition data to bigpanda
        apiHelper.sendDataToBigPanda(data, locationKey, (err) => {
          if (!err) {
            res.send('Success!');
            res.end();
          } else {
            res.send(err);
            res.end();
          }
        });
      } else {
        res.send(err);
        res.end();
      }
    });
  } else {
    res.send('Error: Location Key input empty or invalid');
    res.end();
  }

});

app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', `Server listening on port ${PORT}`);
});
