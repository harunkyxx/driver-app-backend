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
/**
 * @swagger
 * /api/rides:
 *   post:
 *     summary: Create a new ride
 *     description: Creates a new ride request for the logged-in customer.
 *     tags:
 *       - Rides
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupLocation
 *               - destination
 *             properties:
 *               pickupLocation:
 *                 type: string
 *                 example: West Footscray
 *               destination:
 *                 type: string
 *                 example: Melbourne CBD
 *     responses:
 *       201:
 *         description: Ride created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Customer role required
 */

router.post("/", authMiddleware, roleMiddleware("CUSTOMER"), createRide);
/**
 * @swagger
 * /api/rides:
 *   get:
 *     summary: Get pending rides
 *     description: Returns available pending rides for drivers or admins.
 *     tags:
 *       - Rides
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending rides returned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Driver or Admin role required
 */

router.get("/", authMiddleware, roleMiddleware("DRIVER", "ADMIN"), getPendingRides);
/**
 * @swagger
 * /api/rides/my:
 *   get:
 *     summary: Get my rides
 *     description: Returns rides created by the logged-in customer.
 *     tags:
 *       - Rides
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer rides returned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Customer role required
 */

router.get("/my", authMiddleware, roleMiddleware("CUSTOMER"), getMyRides);
/**
 * @swagger
 * /api/rides/{id}/accept:
 *   patch:
 *     summary: Accept a ride
 *     description: Allows a driver to accept a pending ride.
 *     tags:
 *       - Rides
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Ride accepted successfully
 *       400:
 *         description: Ride is not available
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Driver role required
 *       404:
 *         description: Ride not found
 */

router.patch("/:id/accept", authMiddleware, roleMiddleware("DRIVER"), acceptRide);
/**
 * @swagger
 * /api/rides/{id}/complete:
 *   patch:
 *     summary: Complete a ride
 *     description: Allows the assigned driver to complete an accepted ride.
 *     tags:
 *       - Rides
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Ride completed successfully
 *       400:
 *         description: Ride cannot be completed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Driver is not allowed to complete this ride
 *       404:
 *         description: Ride not found
 */

router.patch("/:id/complete", authMiddleware, roleMiddleware("DRIVER"), completeRide);
module.exports = router;