const controller = require("../controllers/feed.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.get("/feed", protectedRoute, controller.get);
}

module.exports = load;
