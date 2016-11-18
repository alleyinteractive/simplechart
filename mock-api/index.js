/**
 * Set up routes for mock API to test widget
 */

var getApiResult = require('./getApiResult.bundle');
console.log(getApiResult) // => {}

module.exports = function(app) {
  console.log('Setting up mock API route');
  app.get('/api/:id', function(req, res) {
    res.json(getApiResult(req.params.id));
  });
};
