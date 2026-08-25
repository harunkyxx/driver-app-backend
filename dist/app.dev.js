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
app.use(express.json()); // Frontend

app.use(express["static"]("public")); // Swagger

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // API routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);
module.exports = app;