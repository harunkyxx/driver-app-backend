"use strict";

var mongoose = require("mongoose");

var rideSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    "default": null
  },
  pickupLocation: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    "enum": ["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"],
    "default": "PENDING"
  },
  distanceKm: {
    type: Number,
    required: true
  },
  fare: {
    type: Number,
    "default": 0
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Ride", rideSchema);