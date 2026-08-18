const express = require("express");

const {
  getUsers,
  createUser,
  getUserById,
  getCurrentUser,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getUsers);

router.get("/me", authMiddleware, getCurrentUser);

router.post("/", authMiddleware, createUser);

router.get("/:id", getUserById);

module.exports = router;