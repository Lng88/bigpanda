/*
 * Test runner
 *
 */

// Override the NODE_ENV variable
process.env.NODE_ENV = 'testing';

const _app = {};

_app.tests = {};
_app.tests.unit = require('./unit');

// Loop through test object and count number of tests
_app.countTests = () => {
  let counter = 0;
  for (let key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key];
      for (let testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          counter++
        }
      }
    }
  }
  return counter;
}

_app.runTests = () => {
  let errors = [];
  let successes = 0;
  let limit = _app.countTests();
  let counter = 0;

  for (let key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      let subTests = _app.tests[key];
      for (let testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          (() => {
            let testValue = subTests[testName];
            // Call the test
            try {
              // Done callback triggers after test finishes
              testValue(() => {
                counter++;
                successes++;
                if (counter == limit) {
                  _app.produceTestReport(limit, successes, errors);
                }
              });
            } catch(e) {
              errors.push({
                'name': testName,
                'error': e
              });
              console.log('\x1b[31m%s\x1b[0m', testName);
              counter++;
              if (counter == limit) {
                _app.produceTestReport(limit, successes, errors);
              }
            }
          })();
        }
      }
    }
  }

}

// Produce a test outcome report
_app.produceTestReport = (limit, successes, errors) => {
  console.log("");
  console.log("---------Begin Test Report---------");
  console.log("");
  console.log("Total Tests: " , limit);
  console.log("Pass: ", successes);
  console.log("Fail: ", errors.length);
  console.log("");

  if(errors.length > 0) {
    console.log("---------Begin Error Details---------");
    console.log("");

    errors.forEach(testError => {
      console.log('\x1b[31m%s\x1b[0m', testError.name);
      console.log(testError.error);
      console.log("");
    })

    console.log("---------End Error Details---------");
  }

  console.log("");
  console.log("---------End Test Report---------");
  process.exit(0);
}

_app.runTests();
