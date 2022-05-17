const multer = require("multer");
const upload = multer({ dest: "uploads/profiles/" });

const controller = require("../controllers/user.controller");
const { protectedRoute } = require("../middlewares/auth");

function load(routes) {
  routes.post("/user", controller.create);
  routes.delete("/user", protectedRoute, controller.delete);
  routes.get("/user/:id", protectedRoute, controller.read);
  routes.patch("/user", protectedRoute, upload.single("profilePicture"), controller.edit);
}

module.exports = load;
