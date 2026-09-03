const Ride = require("../models/Ride");
const { getDistanceKm } = require("../services/locationService");
const { sendRideEvent } = require("../services/rabbitService");
const createRide = async (req, res) => {
  try {
    const {
      pickupLocation,
      destination,
    } = req.body;

    if (!pickupLocation || !destination) {
      return res.status(400).json({
        message: "Pickup location and destination are required",
      });
    }

    const distanceKm = await getDistanceKm(
      pickupLocation,
      destination
    );

    const baseFare = 5;
    const pricePerKm = 2;

    const fare = baseFare + distanceKm * pricePerKm;

    const ride = await Ride.create({
      customer: req.user.userId,
      pickupLocation,
      destination,
      distanceKm,
      fare: Number(fare.toFixed(2)),
    });
sendRideEvent({
  type: "RIDE_CREATED",
  rideId: ride._id.toString(),
  customerId: ride.customer.toString(),
  pickupLocation: ride.pickupLocation,
  destination: ride.destination,
  fare: ride.fare,
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
sendRideEvent({
  type: "RIDE_ACCEPTED",
  rideId: ride._id.toString(),
  customerId: ride.customer.toString(),
  driverId: ride.driver.toString(),
  status: ride.status,
});
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
    sendRideEvent({
  type: "RIDE_COMPLETED",
  rideId: ride._id.toString(),
  customerId: ride.customer.toString(),
  driverId: ride.driver.toString(),
  status: ride.status,
});

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
const updateRide = async (req, res) => {
  try {
    const { pickupLocation, destination } = req.body;

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (ride.customer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You cannot update this ride",
      });
    }

    if (ride.status !== "PENDING") {
      return res.status(400).json({
        message: "Only pending rides can be updated",
      });
    }

    if (!pickupLocation && !destination) {
      return res.status(400).json({
        message: "Pickup location or destination is required",
      });
    }

    if (pickupLocation) {
      ride.pickupLocation = pickupLocation;
    }

    if (destination) {
      ride.destination = destination;
    }

    await ride.save();

    res.status(200).json({
      message: "Ride updated successfully",
      ride,
    });
  } catch (error) {
    console.error("Update ride error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    if (ride.customer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You cannot delete this ride",
      });
    }

    if (ride.status !== "PENDING") {
      return res.status(400).json({
        message: "Only pending rides can be deleted",
      });
    }

    await ride.deleteOne();

    res.status(200).json({
      message: "Ride deleted successfully",
    });
  } catch (error) {
    console.error("Delete ride error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const getDriverRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      driver: req.user.userId,
    })
      .populate("customer", "firstName lastName phone")
      .sort({ createdAt: -1 });

    res.status(200).json(rides);
  } catch (error) {
    console.error("Get driver rides error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
      });
    }

    // CUSTOMER cancel
    if (req.user.role === "CUSTOMER") {
      if (ride.customer.toString() !== req.user.userId) {
        return res.status(403).json({
          message: "You cannot cancel this ride",
        });
      }

      if (ride.status !== "PENDING") {
        return res.status(400).json({
          message: "Customer can only cancel a pending ride",
        });
      }
    }

    // DRIVER cancel
    if (req.user.role === "DRIVER") {
      if (
        !ride.driver ||
        ride.driver.toString() !== req.user.userId
      ) {
        return res.status(403).json({
          message: "You are not the driver of this ride",
        });
      }

      if (ride.status !== "ACCEPTED") {
        return res.status(400).json({
          message: "Driver can only cancel an accepted ride",
        });
      }
    }

    ride.status = "CANCELLED";

    await ride.save();
    sendRideEvent({
  type: "RIDE_CANCELLED",
  rideId: ride._id.toString(),
  customerId: ride.customer.toString(),
  driverId: ride.driver ? ride.driver.toString() : null,
  cancelledBy: req.user.role,
  status: ride.status,
});

    res.status(200).json({
      message: "Ride cancelled successfully",
      ride,
    });
  } catch (error) {
    console.error("Cancel ride error:", error);

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
  updateRide,
  deleteRide,
  getDriverRides,
  cancelRide
};