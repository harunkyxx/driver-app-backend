require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = require("../app");
const User = require("../src/models/User");
const Ride = require("../src/models/Ride");

let customer;
let otherCustomer;
let driver;
let customerToken;
let otherCustomerToken;
let driverToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await Ride.deleteMany({});
  await User.deleteMany({});

  customer = await User.create({
    firstName: "John",
    lastName: "Customer",
    email: "john@test.com",
    phone: "0400000001",
    passwordHash: "test-password-hash",
    role: "CUSTOMER",
  });

  otherCustomer = await User.create({
    firstName: "Sarah",
    lastName: "Customer",
    email: "sarah@test.com",
    phone: "0400000002",
    passwordHash: "test-password-hash",
    role: "CUSTOMER",
  });

  driver = await User.create({
    firstName: "David",
    lastName: "Driver",
    email: "driver@test.com",
    phone: "0400000003",
    passwordHash: "test-password-hash",
    role: "DRIVER",
  });

  customerToken = jwt.sign(
    {
      userId: customer._id,
      role: customer.role,
    },
    process.env.JWT_SECRET
  );

  otherCustomerToken = jwt.sign(
    {
      userId: otherCustomer._id,
      role: otherCustomer.role,
    },
    process.env.JWT_SECRET
  );

  driverToken = jwt.sign(
    {
      userId: driver._id,
      role: driver.role,
    },
    process.env.JWT_SECRET
  );
});

afterAll(async () => {
  await Ride.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("Rides API", () => {
  test("POST /api/rides returns 201 when ride is created", async () => {
    const response = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        pickupLocation: "Sunshine",
        destination: "Melbourne CBD",
      });

    expect(response.status).toBe(201);
  });

  test("POST /api/rides returns 400 with invalid body", async () => {
    const response = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  test("POST /api/rides returns 401 without token", async () => {
    const response = await request(app)
      .post("/api/rides")
      .send({
        pickupLocation: "Sunshine",
        destination: "Melbourne CBD",
      });

    expect(response.status).toBe(401);
  });

  test("POST /api/rides returns 403 when driver tries to create ride", async () => {
    const response = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        pickupLocation: "Sunshine",
        destination: "Melbourne CBD",
      });

    expect(response.status).toBe(403);
  });

  test("PATCH /api/rides/:id returns 200 when customer updates ride", async () => {
    const ride = await Ride.create({
      customer: customer._id,
      pickupLocation: "Sunshine",
      destination: "Melbourne CBD",
      status: "PENDING",
    });

    const response = await request(app)
      .patch(`/api/rides/${ride._id}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        pickupLocation: "Footscray",
      });

    expect(response.status).toBe(200);
  });

  test("PATCH /api/rides/:id returns 403 when another customer updates ride", async () => {
    const ride = await Ride.create({
      customer: customer._id,
      pickupLocation: "Sunshine",
      destination: "Melbourne CBD",
      status: "PENDING",
    });

    const response = await request(app)
      .patch(`/api/rides/${ride._id}`)
      .set("Authorization", `Bearer ${otherCustomerToken}`)
      .send({
        pickupLocation: "Footscray",
      });

    expect(response.status).toBe(403);
  });

  test("PATCH /api/rides/:id returns 404 for unknown ride", async () => {
    const unknownId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .patch(`/api/rides/${unknownId}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        pickupLocation: "Footscray",
      });

    expect(response.status).toBe(404);
  });

  test("DELETE /api/rides/:id returns 200 when customer deletes ride", async () => {
    const ride = await Ride.create({
      customer: customer._id,
      pickupLocation: "Sunshine",
      destination: "Melbourne CBD",
      status: "PENDING",
    });

    const response = await request(app)
      .delete(`/api/rides/${ride._id}`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(response.status).toBe(200);
  });

  test("DELETE /api/rides/:id returns 403 when another customer deletes ride", async () => {
    const ride = await Ride.create({
      customer: customer._id,
      pickupLocation: "Sunshine",
      destination: "Melbourne CBD",
      status: "PENDING",
    });

    const response = await request(app)
      .delete(`/api/rides/${ride._id}`)
      .set("Authorization", `Bearer ${otherCustomerToken}`);

    expect(response.status).toBe(403);
  });

  test("DELETE /api/rides/:id returns 404 for unknown ride", async () => {
    const unknownId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/api/rides/${unknownId}`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(response.status).toBe(404);
  });
});