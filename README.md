# BigPanda
Bigpanda takehome built with Node Express server. Express server listening on port 3000, which will serve a static HTML file. Provide a location key to the form input on HTML. Form submit will trigger a post call to /api/locationKey endpoint and grab API gzip data from Accuweather. If successful, data will be posted with JSON payload to BigPanda alerts API. 

## Installation
Use npm package manager to install dependencies.
```bash
npm install
```

## Start Server
Once dependencies are installed, start the server and navigate to URL localhost:3000.
```bash
npm start
```

## Test
Only had time for one test, which tests the success of posting data to BigPanda API. To run test, simply run:
```bash
npm test
```
