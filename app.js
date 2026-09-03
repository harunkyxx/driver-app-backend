const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./src/swagger");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const rideRoutes = require("./src/routes/rideRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Frontend
app.use(express.static("public"));

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/vehicles", vehicleRoutes);

module.exports = app;