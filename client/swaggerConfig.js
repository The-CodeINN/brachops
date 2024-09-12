// swaggerConfig.js For Configuration
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Title",
      version: "1.0.0",
      description: "A simple Express API application",
    },
    servers: [
      {
        url: "http://localhost:3000", // Change to your development server
      },
    ],
  },
  apis: ["./routes/*.js"], // Files with API routes, e.g. "./routes/*.js"
};

const specs = swaggerJsdoc(options);
module.exports = specs;
