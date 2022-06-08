const { ok, badRequest } = require("../modules/http");
const { models } = require("../modules/sequelize");
const { Op } = require("sequelize");
const { OkStatus, ErrorStatus, IncorrectParameter } = require("../modules/codes");

module.exports = {
  async read(token, userId, username, email) {
    if (!userId && !username && !email) {
      return badRequest({
        status: ErrorStatus,
        code: IncorrectParameter,
        message: "Para buscar um perfil de usuário, informe um ID, nome de usuário ou email.",
      });
    }

    const user = await models.user.findOne({
      where: {
        [Op.or]: [
          {
            id: userId,
          },
          {
            username: username,
          },
        ],
      },
      raw: true,
    });

    if (user) {
      // Remover o campo de senha do retorno
      delete user["password"];
      delete user["activationCode"];

      // Verificar permissão de acesso aos dados desse usuário
      return ok({
        status: OkStatus,
        response: {
          user: user,
        },
      });
    } else {
      return notFound({
        status: ErrorStatus,
        code: UserNotFound,
        message: "Este usuário não foi encontrado.",
      });
    }
  },
};
