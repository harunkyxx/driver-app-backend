"use strict";

require("dotenv").config();

var request = require("supertest");

var mongoose = require("mongoose");

var jwt = require("jsonwebtoken");

var app = require("../app");

var User = require("../src/models/User");

var Ride = require("../src/models/Ride");

var customer;
var otherCustomer;
var driver;
var customerToken;
var otherCustomerToken;
var driverToken;
beforeAll(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(mongoose.connect(process.env.MONGO_URI));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
});
beforeEach(function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Ride.deleteMany({}));

        case 2:
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.deleteMany({}));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.create({
            firstName: "John",
            lastName: "Customer",
            email: "john@test.com",
            phone: "0400000001",
            passwordHash: "test-password-hash",
            role: "CUSTOMER"
          }));

        case 6:
          customer = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(User.create({
            firstName: "Sarah",
            lastName: "Customer",
            email: "sarah@test.com",
            phone: "0400000002",
            passwordHash: "test-password-hash",
            role: "CUSTOMER"
          }));

        case 9:
          otherCustomer = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(User.create({
            firstName: "David",
            lastName: "Driver",
            email: "driver@test.com",
            phone: "0400000003",
            passwordHash: "test-password-hash",
            role: "DRIVER"
          }));

        case 12:
          driver = _context2.sent;
          customerToken = jwt.sign({
            userId: customer._id,
            role: customer.role
          }, process.env.JWT_SECRET);
          otherCustomerToken = jwt.sign({
            userId: otherCustomer._id,
            role: otherCustomer.role
          }, process.env.JWT_SECRET);
          driverToken = jwt.sign({
            userId: driver._id,
            role: driver.role
          }, process.env.JWT_SECRET);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  });
});
afterAll(function _callee3() {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Ride.deleteMany({}));

        case 2:
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.deleteMany({}));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(mongoose.connection.close());

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});
describe("Rides API", function () {
  test("POST /api/rides returns 201 when ride is created", function _callee4() {
    var response;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(request(app).post("/api/rides").set("Authorization", "Bearer ".concat(customerToken)).send({
              pickupLocation: "Sunshine",
              destination: "Melbourne CBD"
            }));

          case 2:
            response = _context4.sent;
            expect(response.status).toBe(201);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
  test("POST /api/rides returns 400 with invalid body", function _callee5() {
    var response;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(request(app).post("/api/rides").set("Authorization", "Bearer ".concat(customerToken)).send({}));

          case 2:
            response = _context5.sent;
            expect(response.status).toBe(400);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
  test("POST /api/rides returns 401 without token", function _callee6() {
    var response;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap(request(app).post("/api/rides").send({
              pickupLocation: "Sunshine",
              destination: "Melbourne CBD"
            }));

          case 2:
            response = _context6.sent;
            expect(response.status).toBe(401);

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    });
  });
  test("POST /api/rides returns 403 when driver tries to create ride", function _callee7() {
    var response;
    return regeneratorRuntime.async(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return regeneratorRuntime.awrap(request(app).post("/api/rides").set("Authorization", "Bearer ".concat(driverToken)).send({
              pickupLocation: "Sunshine",
              destination: "Melbourne CBD"
            }));

          case 2:
            response = _context7.sent;
            expect(response.status).toBe(403);

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    });
  });
  test("PATCH /api/rides/:id returns 200 when customer updates ride", function _callee8() {
    var ride, response;
    return regeneratorRuntime.async(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return regeneratorRuntime.awrap(Ride.create({
              customer: customer._id,
              pickupLocation: "Sunshine",
              destination: "Melbourne CBD",
              status: "PENDING"
            }));

          case 2:
            ride = _context8.sent;
            _context8.next = 5;
            return regeneratorRuntime.awrap(request(app).patch("/api/rides/".concat(ride._id)).set("Authorization", "Bearer ".concat(customerToken)).send({
              pickupLocation: "Footscray"
            }));

          case 5:
            response = _context8.sent;
            expect(response.status).toBe(200);

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    });
  });
  test("PATCH /api/rides/:id returns 403 when another customer updates ride", function _callee9() {
    var ride, response;
    return regeneratorRuntime.async(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return regeneratorRuntime.awrap(Ride.create({
              customer: customer._id,
              pickupLocation: "Sunshine",
              destination: "Melbourne CBD",
              status: "PENDING"
            }));

          case 2:
            ride = _context9.sent;
            _context9.next = 5;
            return regeneratorRuntime.awrap(request(app).patch("/api/rides/".concat(ride._id)).set("Authorization", "Bearer ".concat(otherCustomerToken)).send({
              pickupLocation: "Footscray"
            }));

          case 5:
            response = _context9.sent;
            expect(response.status).toBe(403);

          case 7:
          case "end":
            return _context9.stop();
        }
      }
    });
  });
  test("PATCH /api/rides/:id returns 404 for unknown ride", function _callee10() {
    var unknownId, response;
    return regeneratorRuntime.async(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            unknownId = new mongoose.Types.ObjectId();
            _context10.next = 3;
            return regeneratorRuntime.awrap(request(app).patch("/api/rides/".concat(unknownId)).set("Authorization", "Bearer ".concat(customerToken)).send({
              pickupLocation: "Footscray"
            }));

          case 3:
            response = _context10.sent;
            expect(response.status).toBe(404);

          case 5:
          case "end":
            return _context10.stop();
        }
      }
    });
  });
  test("DELETE /api/rides/:id returns 200 when customer deletes ride", function _callee11() {
    var ride, response;
    return regeneratorRuntime.async(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return regeneratorRuntime.awrap(Ride.create({
              customer: customer._id,
              pickupLocation: "Sunshine",
              destination: "Melbourne CBD",
              status: "PENDING"
            }));

          case 2:
            ride = _context11.sent;
            _context11.next = 5;
            return regeneratorRuntime.awrap(request(app)["delete"]("/api/rides/".concat(ride._id)).set("Authorization", "Bearer ".concat(customerToken)));

          case 5:
            response = _context11.sent;
            expect(response.status).toBe(200);

          case 7:
          case "end":
            return _context11.stop();
        }
      }
    });
  });
  test("DELETE /api/rides/:id returns 403 when another customer deletes ride", function _callee12() {
    var ride, response;
    return regeneratorRuntime.async(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return regeneratorRuntime.awrap(Ride.create({
              customer: customer._id,
              pickupLocation: "Sunshine",
              destination: "Melbourne CBD",
              status: "PENDING"
            }));

          case 2:
            ride = _context12.sent;
            _context12.next = 5;
            return regeneratorRuntime.awrap(request(app)["delete"]("/api/rides/".concat(ride._id)).set("Authorization", "Bearer ".concat(otherCustomerToken)));

          case 5:
            response = _context12.sent;
            expect(response.status).toBe(403);

          case 7:
          case "end":
            return _context12.stop();
        }
      }
    });
  });
  test("DELETE /api/rides/:id returns 404 for unknown ride", function _callee13() {
    var unknownId, response;
    return regeneratorRuntime.async(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            unknownId = new mongoose.Types.ObjectId();
            _context13.next = 3;
            return regeneratorRuntime.awrap(request(app)["delete"]("/api/rides/".concat(unknownId)).set("Authorization", "Bearer ".concat(customerToken)));

          case 3:
            response = _context13.sent;
            expect(response.status).toBe(404);

          case 5:
          case "end":
            return _context13.stop();
        }
      }
    });
  });
});