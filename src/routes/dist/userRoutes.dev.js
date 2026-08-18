"use strict";

var express = require("express");

var _require = require("../controllers/userController"),
    getUsers = _require.getUsers,
    createUser = _require.createUser,
    getUserById = _require.getUserById,
    getCurrentUser = _require.getCurrentUser;

var authMiddleware = require("../middleware/authMiddleware");

var router = express.Router();
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Users returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

router.get("/", getUsers);
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user returned successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

router.get("/me", authMiddleware, getCurrentUser);
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               phone:
 *                 type: string
 *                 example: "0412345678"
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
 *         description: User created successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 */

router.post("/", authMiddleware, createUser);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User returned successfully
 *       404:
 *         description: User not found
 */

router.get("/:id", getUserById);
module.exports = router;