const { sequelize } = require("../modules/sequelize");
const { ok, failure } = require("../modules/http");
const { SequelizeAuto } = require("sequelize-auto");
const { DatabaseFailure } = require("../modules/codes");

module.exports = {
  async connection() {
    await sequelize.authenticate();

    return ok({
      status: "ok",
      response: {
        message: "Teste de conexão ao banco de dados realizada com sucesso.",
      },
    });
  },

  async generate() {
    let response = null;

    const options = {
      directory: "sequelize/models",
      singularize: true,
    };

    const auto = new SequelizeAuto(sequelize, null, null, options);

    await auto
      .run()
      .then((data) => {
        response = ok({
          status: "ok",
          response: {
            message: "Modelos do banco de dados gerados com sucesso.",
          },
        });
      })
      .catch((error) => {
        response = failure({
          status: "error",
          code: DatabaseFailure,
          message: error.message,
        });
      });

    return response;
  },
};
