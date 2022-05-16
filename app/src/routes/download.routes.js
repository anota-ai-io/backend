const controller = require("../controllers/download.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/download", protectedRoute, controller.create);
}

module.exports = load;
