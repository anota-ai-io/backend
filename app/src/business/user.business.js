const crypto = require("crypto");
const validator = require("validator");

const mail = require("../services/mail");
const { fileName } = require("../modules/debug");
const { models } = require("../modules/sequelize");

const { conflict, created, failure, ok, forbidden, notFound } = require("../modules/http");
const { EmailAlreadyInUse, DatabaseFailure, UserNotFound, Forbidden } = require("../modules/codes");

module.exports = {
  async create(email, name, password) {
    const user = await models.user.findOne({
      where: {
        email: email,
      },
      raw: true,
    });

    console.log(user);

    if (user) {
      return conflict({
        status: "error",
        code: EmailAlreadyInUse,
        message: "Este endereço de email já foi cadastrado por outro usuário.",
      });
    } else {
      password = crypto.createHash("md5").update(password).digest("hex");

      const activationCode = crypto.randomBytes(8).toString("hex");

      const user = await models.user.create({
        email,
        name,
        password,
        activationCode,
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
          status: "ok",
          response: {
            user: user,
          },
        });
      } else {
        return failure({
          status: "error",
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
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(userId),
        email: email,
        password: password,
      },
    });

    if (user) {
      // Verifica veracidade dos dados
      if (
        user["id"] == token["userId"] &&
        user["email"] == token["email"] &&
        user["password"] == password
      ) {
        // Remover todos os dados de usuário (de todas as tabelas)
        const deleted = await prisma.$transaction([
          prisma.refreshToken.deleteMany({
            where: {
              userId: parseInt(userId),
            },
          }),
          prisma.user.delete({
            where: {
              id: parseInt(userId),
            },
          }),
        ]);

        // Verifica sucesso da exclusão
        if (deleted) {
          return ok({
            status: "ok",
            response: {
              message: "Conta e dados de usuário removidos com sucesso.",
            },
          });
        } else {
          return failure({
            status: "error",
            code: DatabaseFailure,
            message: "Não foi possível realizar a exclusão de um ou mais dados do banco de dados.",
          });
        }
      } else {
        return forbidden({
          status: "error",
          code: Forbidden,
          message: "O usuário informado não possui permissão para completar esta ação.",
        });
      }
    } else {
      return ok({
        status: "error",
        code: UserNotFound,
        message: "O usuário informado não foi encontrado na base de dados.",
      });
    }
  },

  async read(token, userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user) {
      // Remover o campo de senha do retorno
      delete user["password"];

      // Verificar permissão de acesso aos dados desse usuário
      if (user["id"] == token["userId"] && user["email"] === token["email"]) {
        return ok({
          status: "ok",
          response: {
            user: user,
          },
        });
      } else {
        return forbidden({
          status: "error",
          code: Forbidden,
          message: "Este usuário não possui permissão para acessar a informação solicitada.",
        });
      }
    } else {
      return notFound({
        status: "error",
        code: UserNotFound,
        message: "Este usuário não foi encontrado.",
      });
    }
  },
};