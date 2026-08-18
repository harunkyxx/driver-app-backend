const Ride = require("../models/Ride");

const createRide = async (req, res) => {
  try {
    const { pickupLocation, destination } = req.body;

    if (!pickupLocation || !destination) {
      return res.status(400).json({
        message: "Pickup location and destination are required",
      });
    }

    const ride = await Ride.create({
      customer: req.user.userId,
      pickupLocation,
      destination,
    });

    res.status(201).json({
      message: "Ride created successfully",
      ride,
    });
  } catch (error) {
    console.error("Create ride error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getPendingRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      status: "PENDING",
    }).populate(
      "customer",
      "firstName lastName phone"
    );

    res.status(200).json(rides);
  } catch (error) {
    console.error("Get rides error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (ride.status !== "PENDING") {
      return res.status(400).json({
        message: "Ride is not available",
      });
    }

    ride.driver = req.user.userId;
    ride.status = "ACCEPTED";

    await ride.save();

    res.status(200).json({
      message: "Ride accepted successfully",
      ride,
    });
  } catch (error) {
    console.error("Accept ride error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      customer: req.user.userId,
    })
      .populate("driver", "firstName lastName phone")
      .sort({ createdAt: -1 });

    res.status(200).json(rides);
  } catch (error) {
    console.error("Get my rides error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (ride.status !== "ACCEPTED") {
      return res.status(400).json({
        message: "Ride cannot be completed",
      });
    }

    if (ride.driver.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not the driver of this ride",
      });
    }

    ride.status = "COMPLETED";

    await ride.save();

    res.status(200).json({
      message: "Ride completed successfully",
      ride,
    });
  } catch (error) {
    console.error("Complete ride error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  createRide,
  getPendingRides,
  acceptRide,
  getMyRides,
  completeRide,
};