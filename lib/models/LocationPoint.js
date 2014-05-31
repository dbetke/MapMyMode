'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GeoSchema = new Schema({
  name: String
});


mongoose.model('LocationPoint', GeoSchema);
