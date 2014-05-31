'use strict';

var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    geoFeature:GeoJSON.Feature
});


mongoose.model('LocationObject', Schema);