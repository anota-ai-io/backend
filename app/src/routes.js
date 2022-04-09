const express = require("express");
const routes = express.Router();

const protectedRoute = require("./middlewares/auth");

module.exports = routes;
