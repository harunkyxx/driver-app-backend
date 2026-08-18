"use strict";

var express = require("express");

var cors = require("cors");

var swaggerUi = require("swagger-ui-express");

var swaggerSpec = require("./src/swagger");

var authRoutes = require("./src/routes/authRoutes");

var userRoutes = require("./src/routes/userRoutes");

var rideRoutes = require("./src/routes/rideRoutes");

var app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);
app.get("/", function (req, res) {
  res.json({
    message: "Driver App API is running"
  });
});
module.exports = app;