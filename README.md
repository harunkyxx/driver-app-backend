# Driver App Backend

Driver App Backend is a REST API built with Node.js, Express and MongoDB.

The application allows customers to register, log in and create ride requests. Drivers can view pending rides, accept rides and complete them.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Jest
- Supertest
- CORS

## Features

- User registration
- User login
- JWT authentication
- Customer and Driver roles
- Protected routes
- Create ride
- View pending rides
- Accept ride
- Complete ride
- View customer's rides
- Unit testing with Jest
- API testing with Supertest

## Project Structure

```text
backend/
├── app.js
├── src/
│   ├── server.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── rideController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Ride.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── rideRoutes.js
│   └── utils/
│       └── userUtils.js
└── tests/
    ├── userUtils.test.js
    └── users.test.js