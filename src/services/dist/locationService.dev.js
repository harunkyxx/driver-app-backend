"use strict";

var getDistanceKm = function getDistanceKm(origin, destination) {
  var response, error, data, distanceMeters;
  return regeneratorRuntime.async(function getDistanceKm$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
              "X-Goog-FieldMask": "routes.distanceMeters,routes.duration"
            },
            body: JSON.stringify({
              origin: {
                address: origin
              },
              destination: {
                address: destination
              },
              travelMode: "DRIVE"
            })
          }));

        case 2:
          response = _context.sent;

          if (response.ok) {
            _context.next = 8;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(response.text());

        case 6:
          error = _context.sent;
          throw new Error("Google Routes API error: ".concat(error));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(response.json());

        case 10:
          data = _context.sent;

          if (!(!data.routes || data.routes.length === 0)) {
            _context.next = 13;
            break;
          }

          throw new Error("No route found");

        case 13:
          distanceMeters = data.routes[0].distanceMeters;
          return _context.abrupt("return", distanceMeters / 1000);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  getDistanceKm: getDistanceKm
};