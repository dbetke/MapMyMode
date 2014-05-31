'use strict';

var mongoose = require('mongoose'),
    LocationObject = mongoose.model('LocationObject'),
    LocationPoint = mongoose.model('LocationPoint');

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


// exports.createLocation = function (req, res) {
//   var locationObject;

//   locationObject = new LocationObject({
//       type: 'Point',
//       coordinates: [125.6, 10.1]
//   });

//   locationObject.save(function (err, locationObject) {
//     if (!err) {
//       return console.log('created');
//     }
//     else {
//       return console.log(err);
//     }
//   });

//   //return res.send(locationObject);
// }


exports.locationPoints = function(req, res) {
  return LocationPoint.find(function (err, loc) {
    if (!err) {
      return res.json(loc);
    } else {
      return res.send(err);
    }
  });
};

exports.createLocationPoint = function (req, res) {
  var locPoint;

  locPoint = new LocationPoint({
      type: 'Point',
      coordinates: [125.6, 10.1]
  });

  locPoint.save(function (err, locPoint) {
    if (!err) {
       return console.log('created');
    }
    else {
      return console.log(err);
    }
  });

  return res.send(locPoint);
}

exports.queryLocationIntersections = function (req, res) {
  var locationObject;
  var geoJSON;
  console.log('POST: ');
  console.log(req.params.routeName);

  return 'hi';
}
