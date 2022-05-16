const controller = require("../controllers/like.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/like", protectedRoute, controller.create);
  routes.delete("/like", protectedRoute, controller.delete);
}

module.exports = load;
