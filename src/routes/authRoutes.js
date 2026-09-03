const express = require("express");

const {
  register,
  login,
} = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: >
 *       CUSTOMER must provide carBrand, carModel and vehicleType.
 *       DRIVER must provide driverLicenceNumber.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "0400000000"
 *               password:
 *                 type: string
 *                 example: Password123
 *               role:
 *                 type: string
 *                 enum:
 *                   - CUSTOMER
 *                   - DRIVER
 *                   - ADMIN
 *                 example: CUSTOMER
 *               carBrand:
 *                 type: string
 *                 example: TOYOTA
 *                 description: Required for CUSTOMER
 *               carModel:
 *                 type: string
 *                 example: RAV4
 *                 description: Required for CUSTOMER
 *               vehicleType:
 *                 type: string
 *                 enum:
 *                   - SEDAN
 *                   - SUV
 *                   - HATCHBACK
 *                   - VAN
 *                   - UTE
 *                   - OTHER
 *                 example: SUV
 *                 description: Required for CUSTOMER
 *               driverLicenceNumber:
 *                 type: string
 *                 example: VIC123456
 *                 description: Required for DRIVER
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or missing role-specific fields
 *       409:
 *         description: User already exists
 */
router.post("/register", register);
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "0400000000"
 *               password:
 *                 type: string
 *                 example: Password123
 *               role:
 *                 type: string
 *                 enum:
 *                   - CUSTOMER
 *                   - DRIVER
 *                   - ADMIN
 *                 example: CUSTOMER
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 */
router.post("/register", register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", login);

module.exports = router;