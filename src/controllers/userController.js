const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

   const user = await User.create({
  firstName,
  lastName,
  email: email.toLowerCase(),
  phone,
  passwordHash,
  role: role || "CUSTOMER",

  carBrand: role === "DRIVER" ? carBrand : undefined,
  carModel: role === "DRIVER" ? carModel : undefined,
  vehicleType: role === "DRIVER" ? vehicleType : undefined,
});

    res.status(201).json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    // This lets a valid-but-unknown MongoDB id return 404.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = await User.findById(req.params.id)
      .select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  getUsers,
  createUser,
  getUserById,
  getCurrentUser,
};