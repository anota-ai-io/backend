const express = require("express");
const routes = express.Router();

const SequelizeController = require("./controllers/sequelize.controller");

const protectedRoute = require("./middlewares/auth");

// Rotas de controle do Sequelize
routes.get("/sequelize/connection", SequelizeController.connection);
routes.get("/sequelize/generate", SequelizeController.generate);

module.exports = routes;
