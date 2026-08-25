# Driver App Backend

This is a simple REST API for a Driver App.

Customers can register, login and create rides.  
Drivers can view, accept and complete rides.

## Requirements

Install these programs first:

- Node.js
- Git
- Docker Desktop

Check the installation:

```bash
node -v
npm -v
git --version
docker --version
```

## 1. Download the Project

```bash
git clone https://github.com/harunkyxx/driver-app-backend.git
cd driver-app-backend
```

## 2. Install Packages

Install the required packages:

```bash
npm install express
npm install mongoose
npm install cors
npm install dotenv
npm install bcryptjs
npm install jsonwebtoken
npm install swagger-ui-express
npm install swagger-jsdoc
```

Install the testing and development packages:

```bash
npm install --save-dev nodemon
npm install --save-dev jest
npm install --save-dev supertest
```

You can also install all packages automatically with:

```bash
npm install
```

## 3. Start MongoDB

Open Docker Desktop first.

Then run:

```bash
docker run -d --name driver-app-mongo -p 27017:27017 mongo:latest
```

Check that MongoDB is running:

```bash
docker ps
```

If the container already exists, use:

```bash
docker start driver-app-mongo
```

## 4. Create .env File

Create a `.env` file in the main project folder.

Add:

```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/driver_app
JWT_SECRET=mySecretKey123
```

## 5. Start the Project

Run:

```bash
npm run dev
```

You should see:

```text
MongoDB connected
Server running on http://localhost:5050
```

## 6. Test the API

Open:

```text
http://127.0.0.1:5050
```

Expected result:

```json
{
  "message": "Driver App API is running"
}
```

## 7. Swagger

Open Swagger to view and test the API:

```text
http://127.0.0.1:5050/api-docs
```

Use:

**Try it out → Execute**

For protected endpoints:

1. Login first.
2. Copy the JWT token.
3. Click **Authorize**.
4. Paste the token.
5. Test the endpoint.

## 8. Run Tests

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

## Main Endpoints

```text
POST  /api/auth/register
POST  /api/auth/login

GET   /api/users/me

POST  /api/rides
GET   /api/rides
GET   /api/rides/my
PATCH /api/rides/:id/accept
PATCH /api/rides/:id/complete
```

## Quick Start

```bash
git clone https://github.com/harunkyxx/driver-app-backend.git
cd driver-app-backend
npm install
docker run -d --name driver-app-mongo -p 27017:27017 mongo:latest
npm run dev
```

Then open:

```text
http://127.0.0.1:5050/api-docs
```
http://127.0.0.1:5050           → Frontend
http://127.0.0.1:5050/api-docs  → Swagger
http://127.0.0.1:5050/api/...   → Backend API
## Author

Harun Kaya