const mongoose = require("mongoose");
require("dotenv").config();

const app = require("../app");

const { connectRabbitMQ } = require("./services/rabbitService");
const {
  startRideEventConsumer,
} = require("./services/rideEventConsumer");

const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || "127.0.0.1";

async function startServer() {
  try {
    // MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // RabbitMQ
    await connectRabbitMQ();

    // RabbitMQ Consumer
    await startRideEventConsumer();

    // API Server
  app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});


  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
}

startServer();