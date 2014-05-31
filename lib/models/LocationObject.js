'use strict';

// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema;


// var LocationObject = new Schema ({
//   'type': {
//     type: String,
//     required: true,
//     enum: ['Point', 'LineString', 'Polygon'],
//     default: 'Point'
//   },
//   coordinates: Schema.Types.Mixed, //mongoose doesn't like array of arrays
//   properties: {
//   	name: String,
//   	annotation : String
//   }

// });

// mongoose.model('LocationObject', LocationObject);

var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    geoFeature:GeoJSON.Feature
});


mongoose.model('LocationObject', Schema);