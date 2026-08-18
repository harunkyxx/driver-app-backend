const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const rideRoutes = require("./src/routes/rideRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rides", rideRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Driver App API is running",
  });
});

module.exports = app;