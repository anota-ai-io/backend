const controller = require("../controllers/auth.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/auth/login", controller.login);
  routes.get("/auth/verify", controller.verifyAccount);
  routes.post("/auth/refresh", protectedRoute, controller.refreshToken);
}

module.exports = load;
