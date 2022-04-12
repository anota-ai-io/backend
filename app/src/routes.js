const express = require("express");
const routes = express.Router();

const SequelizeController = require("./controllers/sequelize.controller");
const UserController = require("./controllers/user.controller");
const AuthController = require("./controllers/auth.controller");

const protectedRoute = require("./middlewares/auth");

// Rotas de controle do Sequelize
routes.get("/sequelize/connection", protectedRoute, SequelizeController.connection);
routes.get("/sequelize/generate", protectedRoute, SequelizeController.generate);
routes.get("/sequelize/force", protectedRoute, SequelizeController.force);

// Rotas de Autenticação
routes.post("/auth/login", AuthController.login);
routes.get("/auth/verify", AuthController.verifyAccount);

// Rotas de usuário
routes.post("/user", UserController.create);
routes.delete("/user", protectedRoute, UserController.delete);
routes.get("/user/:id", protectedRoute, UserController.read);

module.exports = routes;
