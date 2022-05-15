const crypto = require("crypto");
const validator = require("validator");
const { Op } = require("sequelize");

const mail = require("../services/mail");
const { fileName } = require("../modules/debug");
const { models, sequelize } = require("../modules/sequelize");
const { OkStatus, ErrorStatus } = require("../modules/codes");

const {
  conflict,
  created,
  failure,
  ok,
  forbidden,
  notFound,
  unauthorized,
} = require("../modules/http");
const {
  EmailAlreadyInUse,
  DatabaseFailure,
  UserNotFound,
  Forbidden,
  Unauthorized,
  UserNameAlreadyInUser,
} = require("../modules/codes");

module.exports = {
  async create(email, name, password, userName) {
    const user = await models.user.findOne({
      where: {
        [Op.or]: [
          {
            email: email,
          },
          {
            username: userName,
          },
        ],
      },
      raw: true,
    });

    if (user) {
      if (email === user["email"]) {
        return conflict({
          status: ErrorStatus,
          code: EmailAlreadyInUse,
          message: "Este endereço de email já foi cadastrado por outro usuário.",
        });
      }
      if (userName === user["username"]) {
        return conflict({
          status: ErrorStatus,
          code: UserNameAlreadyInUser,
          message: "Este username já foi cadastrado por outro usuário.",
        });
      }
    } else {
      password = crypto.createHash("md5").update(password).digest("hex");

      const activationCode = crypto.randomBytes(8).toString("hex");

      const user = await models.user.create({
        email,
        name,
        password,
        activationCode,
        username: userName,
      });

      if (user) {
        // Não enviar email de cadastro em ambiente de teste
        if (process.env.NODE_ENV !== "test" && true) {
          try {
            const { emailHtml, emailText } = await mail.composeEmail(
              user["id"],
              user["name"],
              user["email"],
              user["activationCode"]
            );

            await mail.sendEmail(user["email"], emailText, emailHtml);
          } catch (error) {
            console.log(fileName(), `Erro durante envio de email: ${error.message}`);
          }
        }

        return created({
          status: OkStatus,
          response: {
            user: user,
          },
        });
      } else {
        return failure({
          status: ErrorStatus,
          code: DatabaseFailure,
          message: "Não foi possível inserir o novo usuário no banco de dados.",
        });
      }
    }
  },

  async delete(token, userId, email, password) {
    // Aplicar hash MD5 na senha, se necessário
    if (!validator.isMD5(password)) {
      password = crypto.createHash("md5").update(password).digest("hex");
    }

    // Adquirir dados do usuário informado
    const user = await models.user.findOne({
      where: {
        id: parseInt(userId),
        email: email,
        password: password,
      },
      raw: true,
    });

    if (user) {
      // Verifica veracidade dos dados
      if (
        user["id"] == token["id"] &&
        user["email"] == token["email"] &&
        user["password"] == password
      ) {
        // Remover todos os dados de usuário (de todas as tabelas)
        const deleted = await sequelize.transaction(async (t) => {
          await models.refreshToken.destroy(
            {
              where: {
                userId: parseInt(userId),
              },
            },
            {
              transaction: t,
            }
          );

          await models.user.destroy(
            {
              where: {
                id: parseInt(userId),
              },
            },
            {
              transaction: t,
            }
          );

          return true;
        });

        // Verifica sucesso da exclusão
        if (deleted) {
          return ok({
            status: OkStatus,
            response: {
              message: "Conta e dados de usuário removidos com sucesso.",
            },
          });
        } else {
          return failure({
            status: ErrorStatus,
            code: DatabaseFailure,
            message: "Não foi possível realizar a exclusão de um ou mais dados do banco de dados.",
          });
        }
      } else {
        return forbidden({
          status: ErrorStatus,
          code: Forbidden,
          message: "Não foi possível completar a solicitação, verifique os parâmetros informados.",
        });
      }
    } else {
      return unauthorized({
        status: ErrorStatus,
        code: Unauthorized,
        message: "Não foi possível completar a solicitação, verifique os parâmetros informados.",
      });
    }
  },

  async read(token, userId) {
    const user = await models.user.findOne({
      where: {
        id: userId,
      },
      raw: true,
    });

    if (user) {
      // Remover o campo de senha do retorno
      delete user["password"];
      delete user["activationCode"];

      // Verificar permissão de acesso aos dados desse usuário
      if (user["id"] == token["id"] && user["email"] === token["email"]) {
        return ok({
          status: OkStatus,
          response: {
            user: user,
          },
        });
      } else {
        return forbidden({
          status: ErrorStatus,
          code: Forbidden,
          message: "Este usuário não possui permissão para acessar a informação solicitada.",
        });
      }
    } else {
      return notFound({
        status: ErrorStatus,
        code: UserNotFound,
        message: "Este usuário não foi encontrado.",
      });
    }
  },
};
