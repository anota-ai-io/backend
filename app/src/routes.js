const express = require("express");
const routes = express.Router();
const requireDirectory = require("require-directory");

const routesDefinition = requireDirectory(module, "./routes");

for (const definition in routesDefinition) {
  routesDefinition[definition](routes);
}

module.exports = routes;
