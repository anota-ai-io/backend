const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const controller = require("../controllers/post.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/post", protectedRoute, upload.array("images"), controller.create);
}

module.exports = load;
