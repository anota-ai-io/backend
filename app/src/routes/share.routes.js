const controller = require("../controllers/share.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/share", protectedRoute, controller.create);
}

module.exports = load;
