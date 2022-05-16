const controller = require("../controllers/comment.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/comment", protectedRoute, controller.create);
  routes.get("/comment", protectedRoute, controller.list);
}

module.exports = load;
