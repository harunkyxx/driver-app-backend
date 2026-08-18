const express = require("express");
const {
  createRide,
  getPendingRides,
  acceptRide,
  getMyRides,
  completeRide,
} = require("../controllers/rideController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  createRide
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("DRIVER", "ADMIN"),
  getPendingRides
);

router.patch(
  "/:id/accept",
  authMiddleware,
  roleMiddleware("DRIVER"),
  acceptRide
);
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("CUSTOMER"),
  getMyRides
);

router.patch(
  "/:id/complete",
  authMiddleware,
  roleMiddleware("DRIVER"),
  completeRide
);
module.exports = router;