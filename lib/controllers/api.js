'use strict';

var mongoose = require('mongoose'),
    LocationObject = mongoose.model('LocationObject');

/**
 * Get location lines
 */
exports.locations = function(req, res) {
  return LocationObject.find(function (err, loc) {
    if (!err) {
      return res.json(loc);
    } else {
      return res.send(err);
    }
  });
};

exports.createLocation = function (req, res) {
  var locationObject;

  locationObject = new LocationObject({
      type: 'Point',
      coordinates: [125.6, 10.1]
  });

  locationObject.save(function (err) {
    if (!err) {
      return console.log('created');
    }
    else {
      return console.log(err);
    }
  });

  return res.send(locationObject);
}

exports.queryLocationIntersections = function (req, res) {
  var locationObject;
  var geoJSON;
  console.log('POST: ');
  console.log(req.params.routeName);

  return 'hi';
}
