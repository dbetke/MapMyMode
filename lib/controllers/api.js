'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    LocationPoint = mongoose.model('LocationPoint');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Get location points
 */  
exports.locationPoints = function(req, res) {
  return LocationPoint.find(function (err, points) {
    if (!err) {
      return res.json(points);
    } else {
      return res.send(err);
    }
  });
};
