const controller = require("../controllers/profile.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.get("/profile", protectedRoute, controller.read);
}

module.exports = load;
