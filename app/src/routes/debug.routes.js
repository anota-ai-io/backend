const controller = require("../controllers/debug.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.get("/debug/feed", protectedRoute, controller.feed);
}

module.exports = load;
