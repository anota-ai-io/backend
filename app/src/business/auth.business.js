const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");

const { models } = require("../modules/sequelize");

const { failure, unauthorized, ok, forbidden } = require("../modules/http");
const {
  Unauthorized,
  AccountNotVerified,
  IncorrectParameter,
  DatabaseFailure,
  JWTFailure,
  Forbidden,
  ErrorStatus,
  OkStatus,
} = require("../modules/codes");

module.exports = {
  async login(email, password) {
    // Verifica se a senha informada está no formato de hash MD5
    if (!validator.isMD5(password)) {
      password = crypto.createHash("md5").update(password).digest("hex");
    }

    // Verificação de usuário e senha contra o banco de dados
    const user = await models.user.findOne({
      where: {
        email: email,
        password: password,
      },
      raw: true,
    });

    if (user) {
      // Dados de usuário encontrados, conferir por status da conta
      if (user["active"]) {
        // Construir o payload do token com os dados necessários
        const payload = {
          id: parseInt(user["id"]),
          email: user["email"],
          name: user["name"],
          username: user["username"],
          profilePicture: user["profilePicture"],
        };

        // Criar o token relacionado a esta operação de login
        const token = await this.createToken(payload);

        if (token.status === "error") {
          return failure(token);
        } else {
          return ok(token);
        }
      } else {
        return ok({
          status: ErrorStatus,
          code: AccountNotVerified,
          message:
            "Para realizar o login, é necessário realizar a confirmação de cadastro via email.",
        });
      }
    } else {
      return unauthorized({
        status: ErrorStatus,
        code: Unauthorized,
        message: "Usuário ou senha incorretos.",
      });
    }
  },

  async verifyAccount(userId, email, activationCode) {
    // Buscar os dados de usuário do banco de dados
    const user = await models.user.findOne({
      where: {
        id: userId,
        email,
        activationCode,
        active: false,
      },
      raw: true,
    });

    if (user) {
      // Usuario encontrado, realizar modificação de ativação
      const activeUser = await models.user.update(
        {
          active: true,
        },
        {
          where: {
            id: userId,
            activationCode,
          },
        }
      );
      // Os objetos a seguir são objetos simples, e não objetos http
      if (activeUser) {
        return {
          status: OkStatus,
          response: {
            message: "Conta de usuário confirmada com sucesso.",
          },
        };
      } else {
        return {
          status: ErrorStatus,
          error: DatabaseFailure,
          message: "Erro durante a confirmação de conta de usário.",
        };
      }
    } else {
      return {
        status: ErrorStatus,
        code: IncorrectParameter,
        message: "Os dados de usuários ou de confirmação não são válidos.",
      };
    }
  },

  async refreshToken(token, refreshToken) {
    const userId = parseInt(token["id"]);
    const userEmail = token["email"];
    const userName = token["name"];

    const refresh = await models.refreshToken.findOne({
      where: {
        id: refreshToken,
      },
      raw: true,
    });

    console.log(refresh);

    console.log(token, refreshToken);

    console.log("-------");
    console.log(userId, typeof userId, userEmail, typeof userEmail);
    console.log(
      refresh["userId"],
      typeof parseInt(refresh["userId"]),
      refresh["email"],
      typeof refresh["email"]
    );

    if (refresh) {
      // Verificação de autenticidade do refresh token informado
      if (userId !== parseInt(refresh["userId"]) || userEmail !== refresh["email"]) {
        return forbidden({
          status: ErrorStatus,
          code: Forbidden,
          message:
            "Os dados presentes no token não são válidos com os dados presentes no refresh token.",
        });
      }

      // Verificações de validade do refresh token informado
      const currentTime = dayjs().valueOf().toString().slice(0, 10);

      if (currentTime < parseInt(refresh["iat"])) {
        return ok({
          status: ErrorStatus,
          code: RefreshTokenNotBefore,
          message:
            "O horário de criação do refresh token informado é anterior ao horário atual, ajuste o horário do seu dispositivo.",
        });
      }

      if (currentTime > parseInt(refresh["exp"])) {
        return ok({
          status: ErrorStatus,
          code: RefreshTokenExpired,
          message: "O refresh token informado expirou, realize o login novamente.",
        });
      }

      // Todas as validações foram executadas, criar novo token de acesso
      const newToken = await this.createToken({
        id: userId,
        email: userEmail,
        name: userName,
      });

      if (newToken["status"] === "ok") {
        // Token criado com sucesso, aplicar Refresh Token Rotation
        await models.refreshToken.destroy({
          where: {
            id: refreshToken,
          },
        });

        // Retornar novos tokens de acesso que foram criados
        return ok(newToken);
      } else {
        return ok({
          status: OkStatus,
          code: JWTFailure,
          message: "Erro durante a criação de novo token de acesso através do refresh token.",
        });
      }
    } else {
      return ok({
        status: ErrorStatus,
        code: InvalidRefreshToken,
        message: "O refresh token informado não foi encontrado na base de dados de autenticação.",
      });
    }
  },

  async createToken(payload) {
    // Realiza assinatura do token com base no payload e no token secret da aplicação
    const accessToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24,
    });

    // Criação de um novo refresh token
    const randomToken = crypto.randomBytes(64).toString("hex");

    // Criação das datas "issued at" e "expiration" em formato unix ms
    const iat = dayjs().valueOf();
    const exp = dayjs(iat).add(7, "day").valueOf();

    // Converte o formato das datas em segundos (desconsiderar últimos três caracteres)
    const iatString = iat.toString().slice(0, 10);
    const expString = exp.toString().slice(0, 10);

    // Salvar o refresh token no banco de dados
    const refresh = await models.refreshToken.create({
      id: randomToken,
      email: payload["email"],
      userId: payload["id"],
      iat: iatString,
      exp: expString,
    });

    if (refresh) {
      return {
        status: OkStatus,
        response: {
          accessToken: accessToken,
          refreshToken: randomToken,
        },
      };
    } else {
      return {
        status: ErrorStatus,
        code: JWTFailure,
        message: "Não foi possível realizar o registro do refresh token criado.",
      };
    }
  },

  async verifyToken(token) {
    if (token) {
      try {
        // Tenta realizar validação do token informado
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        // Token validado com sucesso, extrair dados de usuário
        const user = await models.user.findOne({
          where: {
            id: parseInt(decoded["id"]),
            email: decoded["email"],
          },
          raw: true,
        });

        if (user) {
          return decoded;
        } else {
          return {
            status: ErrorStatus,
            code: JWTFailure,
            message: "Dados de usuário presente no token não são válidos.",
          };
        }
      } catch (error) {
        return {
          status: ErrorStatus,
          code: JWTFailure,
          message: `Erro ao validar token JWT: ${error.message}`,
        };
      }
    } else {
      return {
        status: ErrorStatus,
        code: IncorrectParameter,
        message: "Nenhum token de autenticação informado.",
      };
    }
  },
};
