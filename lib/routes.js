'use strict';

var api = require('./controllers/api'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/locations', api.locations);
  app.get('/api/locationPoints', api.locationPoints);
  //app.get('/api/findLocationPoints', api.getLocationPoints)
  app.get('/api/findLocationPoints', api.getLocationPoints)
  app.get('/api/locationIntersections/:routeName', api.queryLocationIntersections);

  //app.post('/api/locations', api.createLocation);
  app.post('/api/locations', api.createLocationPoint);

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};