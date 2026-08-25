"use strict";

var Ride = require("../models/Ride");

var _require = require("../services/locationService"),
    getDistanceKm = _require.getDistanceKm;

var createRide = function createRide(req, res) {
  var _req$body, pickupLocation, destination, distanceKm, baseFare, pricePerKm, fare, ride;

  return regeneratorRuntime.async(function createRide$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, pickupLocation = _req$body.pickupLocation, destination = _req$body.destination;

          if (!(!pickupLocation || !destination)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Pickup location and destination are required"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(getDistanceKm(pickupLocation, destination));

        case 6:
          distanceKm = _context.sent;
          baseFare = 5;
          pricePerKm = 2;
          fare = baseFare + distanceKm * pricePerKm;
          _context.next = 12;
          return regeneratorRuntime.awrap(Ride.create({
            customer: req.user.userId,
            pickupLocation: pickupLocation,
            destination: destination,
            distanceKm: distanceKm,
            fare: Number(fare.toFixed(2))
          }));

        case 12:
          ride = _context.sent;
          res.status(201).json({
            message: "Ride created successfully",
            ride: ride
          });
          _context.next = 20;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.error("Create ride error:", _context.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var getPendingRides = function getPendingRides(req, res) {
  var rides;
  return regeneratorRuntime.async(function getPendingRides$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Ride.find({
            status: "PENDING"
          }).populate("customer", "firstName lastName phone"));

        case 3:
          rides = _context2.sent;
          res.status(200).json(rides);
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error("Get rides error:", _context2.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var acceptRide = function acceptRide(req, res) {
  var ride;
  return regeneratorRuntime.async(function acceptRide$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Ride.findById(req.params.id));

        case 3:
          ride = _context3.sent;

          if (ride) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Ride not found"
          }));

        case 6:
          if (!(ride.status !== "PENDING")) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Ride is not available"
          }));

        case 8:
          ride.driver = req.user.userId;
          ride.status = "ACCEPTED";
          _context3.next = 12;
          return regeneratorRuntime.awrap(ride.save());

        case 12:
          res.status(200).json({
            message: "Ride accepted successfully",
            ride: ride
          });
          _context3.next = 19;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          console.error("Accept ride error:", _context3.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var getMyRides = function getMyRides(req, res) {
  var rides;
  return regeneratorRuntime.async(function getMyRides$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Ride.find({
            customer: req.user.userId
          }).populate("driver", "firstName lastName phone").sort({
            createdAt: -1
          }));

        case 3:
          rides = _context4.sent;
          res.status(200).json(rides);
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error("Get my rides error:", _context4.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var completeRide = function completeRide(req, res) {
  var ride;
  return regeneratorRuntime.async(function completeRide$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Ride.findById(req.params.id));

        case 3:
          ride = _context5.sent;

          if (ride) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "Ride not found"
          }));

        case 6:
          if (!(ride.status !== "ACCEPTED")) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: "Ride cannot be completed"
          }));

        case 8:
          if (!(ride.driver.toString() !== req.user.userId)) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.status(403).json({
            message: "You are not the driver of this ride"
          }));

        case 10:
          ride.status = "COMPLETED";
          _context5.next = 13;
          return regeneratorRuntime.awrap(ride.save());

        case 13:
          res.status(200).json({
            message: "Ride completed successfully",
            ride: ride
          });
          _context5.next = 20;
          break;

        case 16:
          _context5.prev = 16;
          _context5.t0 = _context5["catch"](0);
          console.error("Complete ride error:", _context5.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 20:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var updateRide = function updateRide(req, res) {
  var _req$body2, pickupLocation, destination, ride;

  return regeneratorRuntime.async(function updateRide$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$body2 = req.body, pickupLocation = _req$body2.pickupLocation, destination = _req$body2.destination;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Ride.findById(req.params.id));

        case 4:
          ride = _context6.sent;

          if (ride) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: "Ride not found"
          }));

        case 7:
          if (!(ride.customer.toString() !== req.user.userId)) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(403).json({
            message: "You cannot update this ride"
          }));

        case 9:
          if (!(ride.status !== "PENDING")) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: "Only pending rides can be updated"
          }));

        case 11:
          if (!(!pickupLocation && !destination)) {
            _context6.next = 13;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: "Pickup location or destination is required"
          }));

        case 13:
          if (pickupLocation) {
            ride.pickupLocation = pickupLocation;
          }

          if (destination) {
            ride.destination = destination;
          }

          _context6.next = 17;
          return regeneratorRuntime.awrap(ride.save());

        case 17:
          res.status(200).json({
            message: "Ride updated successfully",
            ride: ride
          });
          _context6.next = 24;
          break;

        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](0);
          console.error("Update ride error:", _context6.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 24:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

var deleteRide = function deleteRide(req, res) {
  var ride;
  return regeneratorRuntime.async(function deleteRide$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Ride.findById(req.params.id));

        case 3:
          ride = _context7.sent;

          if (ride) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: "Ride not found"
          }));

        case 6:
          if (!(ride.customer.toString() !== req.user.userId)) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.status(403).json({
            message: "You cannot delete this ride"
          }));

        case 8:
          if (!(ride.status !== "PENDING")) {
            _context7.next = 10;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            message: "Only pending rides can be deleted"
          }));

        case 10:
          _context7.next = 12;
          return regeneratorRuntime.awrap(ride.deleteOne());

        case 12:
          res.status(200).json({
            message: "Ride deleted successfully"
          });
          _context7.next = 19;
          break;

        case 15:
          _context7.prev = 15;
          _context7.t0 = _context7["catch"](0);
          console.error("Delete ride error:", _context7.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 19:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var getDriverRides = function getDriverRides(req, res) {
  var rides;
  return regeneratorRuntime.async(function getDriverRides$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(Ride.find({
            driver: req.user.userId
          }).populate("customer", "firstName lastName phone").sort({
            createdAt: -1
          }));

        case 3:
          rides = _context8.sent;
          res.status(200).json(rides);
          _context8.next = 11;
          break;

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          console.error("Get driver rides error:", _context8.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var cancelRide = function cancelRide(req, res) {
  var ride;
  return regeneratorRuntime.async(function cancelRide$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(Ride.findById(req.params.id));

        case 3:
          ride = _context9.sent;

          if (ride) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: "Ride not found"
          }));

        case 6:
          if (!(req.user.role === "CUSTOMER")) {
            _context9.next = 11;
            break;
          }

          if (!(ride.customer.toString() !== req.user.userId)) {
            _context9.next = 9;
            break;
          }

          return _context9.abrupt("return", res.status(403).json({
            message: "You cannot cancel this ride"
          }));

        case 9:
          if (!(ride.status !== "PENDING")) {
            _context9.next = 11;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            message: "Customer can only cancel a pending ride"
          }));

        case 11:
          if (!(req.user.role === "DRIVER")) {
            _context9.next = 16;
            break;
          }

          if (!(!ride.driver || ride.driver.toString() !== req.user.userId)) {
            _context9.next = 14;
            break;
          }

          return _context9.abrupt("return", res.status(403).json({
            message: "You are not the driver of this ride"
          }));

        case 14:
          if (!(ride.status !== "ACCEPTED")) {
            _context9.next = 16;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            message: "Driver can only cancel an accepted ride"
          }));

        case 16:
          ride.status = "CANCELLED";
          _context9.next = 19;
          return regeneratorRuntime.awrap(ride.save());

        case 19:
          res.status(200).json({
            message: "Ride cancelled successfully",
            ride: ride
          });
          _context9.next = 26;
          break;

        case 22:
          _context9.prev = 22;
          _context9.t0 = _context9["catch"](0);
          console.error("Cancel ride error:", _context9.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 26:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

module.exports = {
  createRide: createRide,
  getPendingRides: getPendingRides,
  acceptRide: acceptRide,
  getMyRides: getMyRides,
  completeRide: completeRide,
  updateRide: updateRide,
  deleteRide: deleteRide,
  getDriverRides: getDriverRides,
  cancelRide: cancelRide
};