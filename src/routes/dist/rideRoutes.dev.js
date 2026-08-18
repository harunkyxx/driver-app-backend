"use strict";

var express = require("express");

var _require = require("../controllers/rideController"),
    createRide = _require.createRide,
    getPendingRides = _require.getPendingRides,
    acceptRide = _require.acceptRide,
    getMyRides = _require.getMyRides,
    completeRide = _require.completeRide;

var authMiddleware = require("../middleware/authMiddleware");

var roleMiddleware = require("../middleware/roleMiddleware");

var router = express.Router();
router.post("/", authMiddleware, roleMiddleware("CUSTOMER"), createRide);
router.get("/", authMiddleware, roleMiddleware("DRIVER", "ADMIN"), getPendingRides);
router.patch("/:id/accept", authMiddleware, roleMiddleware("DRIVER"), acceptRide);
router.get("/my", authMiddleware, roleMiddleware("CUSTOMER"), getMyRides);
router.patch("/:id/complete", authMiddleware, roleMiddleware("DRIVER"), completeRide);
module.exports = router;