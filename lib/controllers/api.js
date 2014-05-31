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

exports.createLocationPoint = function (req, res) {
  var locationPoint;

  locationPoint = new LocationPoint({
    name: req.body.name
  });

  locationPoint.save(function (err) {
    if (!err) {
      return console.log('created');
    }
    else {
      return console.log(err);
    }
  });

  return res.send(locationPoint);
}

exports.queryLocationPointIntersections = function (req, res) {
  var locationPoint;
  var geoJSON;
  console.log('POST: ');
  console.log(req.params.routeName);

  var
  var locationPoints = LocationPoint.find({
    name : {
      $geoIntersects : {
        $geometry : {
          type : "Line",
          coordinates : [ <coordinates> ]
        }
      }
    }
  });

  return locationPoints;
}
