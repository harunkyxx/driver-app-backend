# Driver App Backend

This project is a REST API backend for a Driver App.

The application allows customers to register, login and create ride requests.
Drivers can login, view available rides, accept rides and complete rides.

This guide explains how to install and run the project on a new computer.

---

# 1. Install Node.js

Node.js is required to run this project.

Download and install Node.js from:

https://nodejs.org/

After installation, open a terminal and check:

```bash
node -v
```

Then check npm:

```bash
npm -v
```

If both commands return version numbers, Node.js and npm are installed correctly.

Example:

```text
v20.x.x
10.x.x
```

---

# 2. Install Git

Git is required to download the project from GitHub.

Download Git from:

https://git-scm.com/

After installation, check:

```bash
git --version
```

If a Git version is displayed, Git is ready.

---

# 3. Install Docker Desktop

Docker is used to run the MongoDB database for this project.

Download and install Docker Desktop from:

https://www.docker.com/products/docker-desktop/

After installation:

1. Open Docker Desktop.
2. Wait until Docker is running.
3. Open a terminal.
4. Check Docker:

```bash
docker --version
```

Then:

```bash
docker ps
```

If these commands work, Docker is ready.

---

# 4. Download the Project

Open a terminal and run:

```bash
git clone https://github.com/harunkyxx/driver-app-backend.git
```

Then enter the project folder:

```bash
cd driver-app-backend
```

---

# 5. Install Express

Install Express:

```bash
npm install express
```

Express is used to create the API server.

---

# 6. Install MongoDB / Mongoose Package

Install Mongoose:

```bash
npm install mongoose
```

Mongoose connects the Node.js application to MongoDB.

---

# 7. Install CORS

Run:

```bash
npm install cors
```

CORS allows the API to receive requests from other applications.

---

# 8. Install dotenv

Run:

```bash
npm install dotenv
```

dotenv is used to read configuration values from the `.env` file.

---

# 9. Install bcryptjs

Run:

```bash
npm install bcryptjs
```

bcryptjs is used to securely hash user passwords.

---

# 10. Install JWT

Run:

```bash
npm install jsonwebtoken
```

JWT is used for user authentication.

---

# 11. Install Swagger

Install Swagger UI:

```bash
npm install swagger-ui-express
```

Then install Swagger JSDoc:

```bash
npm install swagger-jsdoc
```

Swagger is used to view and test the API from the browser.

---

# 12. Install Nodemon

Run:

```bash
npm install --save-dev nodemon
```

Nodemon automatically restarts the server when the code changes.

---

# 13. Install Jest

Run:

```bash
npm install --save-dev jest
```

Jest is used for automated testing.

---

# 14. Install Supertest

Run:

```bash
npm install --save-dev supertest
```

Supertest is used to test the API endpoints.

---

# 15. Check Installed Packages

Run:

```bash
npm list --depth=0
```

The project should contain packages similar to:

```text
express
mongoose
cors
dotenv
bcryptjs
jsonwebtoken
swagger-ui-express
swagger-jsdoc
nodemon
jest
supertest
```

---

# 16. Start MongoDB with Docker

Make sure Docker Desktop is running.

Then run:

```bash
docker run -d --name driver-app-mongo -p 27017:27017 mongo:latest
```

Docker will download MongoDB automatically if the MongoDB image is not already installed.

Check the container:

```bash
docker ps
```

You should see:

```text
driver-app-mongo
```

If the container was already created previously, start it with:

```bash
docker start driver-app-mongo
```

---

# 17. Create the .env File

Inside the `driver-app-backend` folder, create a file named:

```text
.env
```

Add:

```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/driver_app
JWT_SECRET=mySecretKey123
```

Save the file.

The project should now look similar to:

```text
driver-app-backend
│
├── .env
├── app.js
├── package.json
├── README.md
├── src
└── tests
```

---

# 18. Start the Project

First check that MongoDB is running:

```bash
docker ps
```

Then start the backend:

```bash
npm run dev
```

The terminal should display:

```text
MongoDB connected
Server running on http://localhost:5050
```

Keep this terminal open while testing the application.

---

# 19. Check if the Backend is Working

Open a browser and go to:

```text
http://127.0.0.1:5050
```

The browser should display:

```json
{
  "message": "Driver App API is running"
}
```

If you see this message, the backend is running correctly.

---

# 20. Open Swagger

The API can be tested using Swagger.

Open:

```text
http://127.0.0.1:5050/api-docs
```

Swagger will display the available API endpoints.

The main sections are:

```text
Authentication
Users
Rides
```

To test an endpoint:

1. Select an endpoint.
2. Click `Try it out`.
3. Enter the required data.
4. Click `Execute`.

---

# 21. Test Registration

In Swagger open:

```text
POST /api/auth/register
```

Click `Try it out`.

Example:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phone": "0400000000",
  "password": "Password123",
  "role": "CUSTOMER"
}
```

Click `Execute`.

A successful request should return:

```text
201 Created
```

---

# 22. Test Login

Open:

```text
POST /api/auth/login
```

Use:

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

Click `Execute`.

A successful login returns a JWT token.

Example:

```json
{
  "message": "Login successful",
  "token": "eyJ..."
}
```

Copy the token.

---

# 23. Authorize Swagger

Click the `Authorize` button at the top of Swagger.

Paste the JWT token.

Click:

```text
Authorize
```

You can now test protected API endpoints.

---

# 24. Test the Automated Tests

Open another terminal inside the project folder.

Run:

```bash
npm test
```

The project uses Jest and Supertest for automated testing.

To see test coverage, run:

```bash
npm run test:coverage
```

---

# API Endpoints

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Users

```text
GET  /api/users
POST /api/users
GET  /api/users/me
GET  /api/users/:id
```

## Rides

```text
POST  /api/rides
GET   /api/rides
GET   /api/rides/my
PATCH /api/rides/:id/accept
PATCH /api/rides/:id/complete
```

---

# Installation Summary

The following software is required:

```text
Node.js
npm
Git
Docker Desktop
```

The following Node.js packages are used:

```text
express
mongoose
cors
dotenv
bcryptjs
jsonwebtoken
swagger-ui-express
swagger-jsdoc
nodemon
jest
supertest
```

After installing everything:

```bash
docker start driver-app-mongo
```

Then:

```bash
npm run dev
```

Finally open:

```text
http://127.0.0.1:5050/api-docs
```

The project is now ready to use and test.