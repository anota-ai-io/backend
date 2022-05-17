const multer = require("multer");
const upload = multer({ dest: "uploads/posts/" });

const controller = require("../controllers/post.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/post", protectedRoute, upload.array("images"), controller.create);
  routes.get("/post", protectedRoute, controller.list);
}

module.exports = load;
