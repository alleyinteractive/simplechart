/**
 * Set up routes for mock API to test widget
 */

import getApiResult from './getApiResult';

module.exports = function(app) {
  console.log('Setting up mock API route. **Note that server-side modules are NOT hot-reloaded!**');
  app.get('/api/:id', function(req, res) {
    res.json(getApiResult(req.params.id));
  });
};
