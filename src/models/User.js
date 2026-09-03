const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["CUSTOMER", "DRIVER", "ADMIN"],
      default: "CUSTOMER",
    },
    carBrand: {
  type: String,
  trim: true,
},

carModel: {
  type: String,
  trim: true,
},

vehicleType: {
  type: String,
  enum: [
    "SEDAN",
    "SUV",
    "HATCHBACK",
    "VAN",
    "UTE",
    "OTHER"
  ],
},
driverLicenceNumber: {
  type: String,
  trim: true,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);


