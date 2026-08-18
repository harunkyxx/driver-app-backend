const mongoose = require("mongoose");
require("dotenv").config();

const app = require("../app");

const PORT = process.env.PORT || 5050;

async function startServer() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected");

    app.listen(PORT, "127.0.0.1", () => {
      console.log(`Server running on http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
}

startServer();