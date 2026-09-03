const express = require("express");

const {
  getMakes,
  getModels,
  getVehicleTypes,
} = require("../controllers/vehicleController");

const router = express.Router();

/**
 * @swagger
 * /api/vehicles/makes:
 *   get:
 *     summary: Get all car brands
 *     description: Get available car brands from the external vehicle API.
 *     tags:
 *       - Vehicles
 *     responses:
 *       200:
 *         description: Car brands loaded successfully
 *       500:
 *         description: Could not load car brands
 */
router.get("/makes", getMakes);

/**
 * @swagger
 * /api/vehicles/models/{make}:
 *   get:
 *     summary: Get car models by brand
 *     description: Get available car models for the selected car brand.
 *     tags:
 *       - Vehicles
 *     parameters:
 *       - in: path
 *         name: make
 *         required: true
 *         schema:
 *           type: string
 *         example: Toyota
 *         description: Car brand name
 *     responses:
 *       200:
 *         description: Car models loaded successfully
 *       500:
 *         description: Could not load car models
 */
router.get("/models/:make", getModels);


// We still keep this endpoint in the backend,
// but it is not currently used by the frontend.
router.get("/types/:make", getVehicleTypes);

module.exports = router;