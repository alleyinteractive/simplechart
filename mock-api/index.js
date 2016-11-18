/**
 * Set up routes for mock API to test widget
 */

import getApiResult from './getApiResult';

module.exports = function(app) {
  console.log('Setting up mock API route');
  app.get('/api/:id', function(req, res) {
    res.json(getApiResult(req.params.id));
  });
};
