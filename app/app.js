const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: "../.env" });
const customErrorHandler = require("./src/middlewares/error");
const { NotFound } = require("./src/modules/codes");
const { sequelize } = require("./src/modules/sequelize");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("./public"));
app.use("/api", require("./src/routes"));

app.get(["/", "/api"], async (req, res) => {
  return res.status(200).json({
    status: "ok",
    response: {
      message: "Anota Aí - API",
      homepage: "https://github.com/anota-ai-io",
      documentation: "https://documenter.getpostman.com/view/19545370/UVyxRZXu",
    },
  });
});

app.get("/connection", async (req, res) => {
  try {
    await sequelize.authenticate();

    console.log("Conexão realizada com");

    return res.status(200).json({
      message: "Sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

app.all("*", async (req, res) => {
  return res.status(404).json({
    status: "error",
    code: NotFound,
    message: "A rota solicitada não foi encontrada ou implementada.",
    documentation: "https://documenter.getpostman.com/view/19545370/UVkmQGwd",
  });
});

app.use(customErrorHandler);

module.exports = app;