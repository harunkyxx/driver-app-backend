require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = require("../app");
const User = require("../src/models/User");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("Users API", () => {

  test("GET /api/users returns 200 and JSON", async () => {
    const response = await request(app)
      .get("/api/users");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
  });


  test("POST /api/users with valid data returns 201", async () => {
    const token = jwt.sign(
      {
        userId: new mongoose.Types.ObjectId(),
        role: "ADMIN",
      },
      process.env.JWT_SECRET
    );

    const response = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "John",
        lastName: "Smith",
        email: "john@example.com",
        phone: "0400000000",
        password: "password123",
        role: "CUSTOMER",
      });

    expect(response.status).toBe(201);
  });


  test("POST /api/users without auth header returns 401", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        firstName: "John",
        lastName: "Smith",
        email: "john@example.com",
        phone: "0400000000",
        password: "password123",
      });

    expect(response.status).toBe(401);
  });


  test("POST /api/users with invalid body returns 400", async () => {
    const token = jwt.sign(
      {
        userId: new mongoose.Types.ObjectId(),
        role: "ADMIN",
      },
      process.env.JWT_SECRET
    );

    const response = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });


  test("GET /api/users with unknown id returns 404", async () => {
    const unknownId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/api/users/${unknownId}`);

    expect(response.status).toBe(404);
  });

});