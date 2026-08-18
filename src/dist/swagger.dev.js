"use strict";

var swaggerJsdoc = require("swagger-jsdoc");

var options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Driver App API",
      version: "1.0.0",
      description: "API documentation for the Driver App backend"
    },
    servers: [{
      url: "http://127.0.0.1:5050",
      description: "Local development server"
    }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};
var swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;