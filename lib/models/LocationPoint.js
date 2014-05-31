'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var LocationPoint = new Schema ({
  'type': {
    type: String,
    required: true,
    enum: ['Feature'],
    default: 'Feature'
  },
  geometry: {
    'type': {
      type: String,
      required: true,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number],
  },
  properties: {
  	name: String,
  	annotation : String
  }

});

mongoose.model('LocationPoint', LocationPoint);