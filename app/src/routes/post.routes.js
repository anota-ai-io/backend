const controller = require("../controllers/post.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/post", protectedRoute, controller.create);
}

module.exports = load;
