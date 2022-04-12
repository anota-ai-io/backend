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

app.all("*", async (req, res) => {
  return res.status(404).json({
    status: "error",
    code: NotFound,
    message: "A rota solicitada não foi encontrada ou implementada.",
    documentation: "https://documenter.getpostman.com/view/19545370/UVyxRZXu",
  });
});

// (async () => {
//   console.log("Iniciando configuração do banco de dados.");
//   try {
//     // try {
//     //   await sequelize.createSchema("public");
//     //   console.log("Schema criado com sucesso.");
//     // } catch (error) {
//     //   console.log("O banco de dados já possui o schema criado.");
//     // }

//     console.log("Sincronizando banco de dados.");

//     await sequelize.sync({ force: true });

//     console.log("Banco de dados sincronizado com sucesso.");
//   } catch (error) {
//     console.error("Erro ao sincronizar banco de dados:", error);
//   }
// })();

app.use(customErrorHandler);

module.exports = app;
