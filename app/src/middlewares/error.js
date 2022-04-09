// Middleware de custom error handler

module.exports = (err, req, res, next) => {
  let file = "";

  if (err.stack.includes("/")) {
    // Unix Based Systems
    file = err.stack.split("\n")[1].split("/").pop().replace(")", "");
  } else {
    // Windows Based Systems
    file = err.stack.split("\n")[1].split("\\").pop().replace(")", "");
  }

  if (file.includes("node_modules")) file = "Dependency File";

  console.log(file, "-", err.name, "-", err.message);

  return res.status(500).json({
    status: "error",
    code: "InternalServerError",
    message: `${file} - ${err.name}: ${err.message}`,
  });
};
