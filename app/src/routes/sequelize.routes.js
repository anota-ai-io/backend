const controller = require("../controllers/sequelize.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.get("/sequelize/connection", protectedRoute, controller.connection);
  routes.get("/sequelize/generate", protectedRoute, controller.generate);
  routes.get("/sequelize/force", protectedRoute, controller.force);
}

module.exports = load;
