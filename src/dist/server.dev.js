"use strict";

var mongoose = require("mongoose");

require("dotenv").config();

var app = require("../app");

var PORT = process.env.PORT || 5050;

function startServer() {
  return regeneratorRuntime.async(function startServer$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("Connecting to MongoDB...");
          _context.next = 4;
          return regeneratorRuntime.awrap(mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
          }));

        case 4:
          console.log("MongoDB connected");
          app.listen(PORT, "127.0.0.1", function () {
            console.log("Server running on http://127.0.0.1:".concat(PORT));
          });
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Server startup error:", _context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

startServer();