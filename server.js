// Import the Express framework.
const express = require("express");

// Import the database connection from the config/connection file.
const db = require("./config/connection");

// Import the routes from the routes file.
const routes = require("./routes");

// Define the port number for the API server.
const PORT = 3001;

// Create an Express application.
const app = express();

// Configure Express to parse incoming URL-encoded and JSON data.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Bind the routes to the Express application.
app.use(routes);

// Connect to the database and start the API server.
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

