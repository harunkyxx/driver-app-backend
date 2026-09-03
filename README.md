# Driver App Backend

This is a REST API for a Driver App.

The application allows customers to request rides and drivers to accept and complete rides.

Customers use their own vehicle, and drivers drive the customer's vehicle.

## Main Features

- Customer and Driver registration
- JWT authentication
- Customer vehicle information
- Driver licence information
- Create, update, cancel and delete rides
- Driver can view and accept available rides
- Driver can complete rides
- Distance calculation using Google Routes API
- Automatic fare calculation
- Vehicle brand and model data using an external Vehicle API
- RabbitMQ ride events
- Swagger API documentation
- Jest and Supertest testing
- Docker Compose setup

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- RabbitMQ
- Docker
- Docker Compose
- Google Routes API
- NHTSA Vehicle API
- Swagger
- Jest
- Supertest

## Requirements

Install these programs first:

- Git
- Docker Desktop

Node.js is also recommended if you want to run the project or tests outside Docker.

Check the installation:

```bash
git --version
docker --version
docker compose version
```

## 1. Download the Project

```bash
git clone https://github.com/harunkyxx/driver-app-backend.git
cd driver-app-backend
```

## 2. Create the .env File

Create a `.env` file in the main project folder:

```bash
touch .env
```

Open the file and add:

```env
PORT=5050
MONGO_URI=mongodb://mongo:27017/driver_app
RABBITMQ_URL=amqp://rabbitmq:5672
JWT_SECRET=your_secret_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Replace:

```text
your_secret_key
```

with your own JWT secret.

Replace:

```text
your_google_maps_api_key
```

with your Google Maps API key.

Do not upload the `.env` file to GitHub.

## 3. Start the Project with Docker

Make sure Docker Desktop is running.

Then run:

```bash
docker compose up --build
```

Docker Compose will start three containers:

```text
driver-app-api
driver-app-mongodb
driver-app-rabbitmq
```

The backend will connect to MongoDB and RabbitMQ automatically.

You should see messages similar to:

```text
MongoDB connected
RabbitMQ connected
Ride event consumer started
Server running on http://0.0.0.0:5050
```

## 4. Check the Containers

Open another terminal and run:

```bash
docker ps
```

You should see the API, MongoDB and RabbitMQ containers running.

## 5. Open the Application

Frontend:

```text
http://127.0.0.1:5050
```

Swagger API Documentation:

```text
http://127.0.0.1:5050/api-docs
```

RabbitMQ Management:

```text
http://127.0.0.1:15672
```

Default RabbitMQ login:

```text
Username: guest
Password: guest
```

## 6. Swagger

Swagger can be used to view and test the API endpoints.

Open:

```text
http://127.0.0.1:5050/api-docs
```

For protected endpoints:

1. Register a user.
2. Login.
3. Copy the JWT token.
4. Click **Authorize** in Swagger.
5. Enter the token.
6. Test the protected endpoints.

## 7. Main API Endpoints

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
```

Users:

```text
GET /api/users/me
```

Rides:

```text
POST   /api/rides
GET    /api/rides
GET    /api/rides/my
GET    /api/rides/driver/my
PATCH  /api/rides/:id
PATCH  /api/rides/:id/accept
PATCH  /api/rides/:id/complete
PATCH  /api/rides/:id/cancel
DELETE /api/rides/:id
```

Vehicles:

```text
GET /api/vehicles/makes
GET /api/vehicles/models/:make
GET /api/vehicles/types/:make
```

## 8. Vehicle Information

Customers provide:

```text
Car Brand
Car Model
Vehicle Type
```

Car brands and models are loaded using the external NHTSA Vehicle API.

Drivers provide:

```text
Driver Licence Number
```

Drivers do not provide a vehicle because the driver drives the customer's vehicle.

## 9. Distance and Fare

The application uses the Google Routes API to calculate the distance between the pickup location and destination.

The ride fare is calculated automatically using the distance.

Example:

```text
Base Fare: $5
Distance: 15 km
Price per km: $2

Total Fare: $35
```

## 10. RabbitMQ

RabbitMQ is used for ride events.

The application uses the queue:

```text
ride_events
```

Example events include:

```text
RIDE_CREATED
RIDE_ACCEPTED
RIDE_COMPLETED
RIDE_CANCELLED
```

The backend publishes ride events and the RabbitMQ consumer receives them.

## 11. Run Tests

If you want to run the tests locally, install the packages:

```bash
npm install
```

Then run:

```bash
npm test
```

Current test result:

```text
Test Suites: 3 passed, 3 total
Tests:       19 passed, 19 total
```

## 12. Stop the Project

To stop Docker Compose:

```bash
docker compose down
```

To start it again:

```bash
docker compose up
```

To rebuild after changing the Docker configuration:

```bash
docker compose up --build
```

## Quick Start

```bash
git clone https://github.com/harunkyxx/driver-app-backend.git
cd driver-app-backend
touch .env
```

Add the required environment variables to `.env`, then run:

```bash
docker compose up --build
```

Open:

```text
Frontend:
http://127.0.0.1:5050

Swagger:
http://127.0.0.1:5050/api-docs

RabbitMQ:
http://127.0.0.1:15672
```

## Author

Harun Kaya