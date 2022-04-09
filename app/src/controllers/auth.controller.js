const path = require("path");

const AuthBusiness = require("../business/auth.business");

const PasswordValidator = require("../validators/user/password.rules");
const EmailValidator = require("../validators/user/email.rules");
const ActivationValidator = require("../validators/user/activation.rules");
const UserIdValidator = require("../validators/user/id.rules");

const validation = require("../modules/validation");

module.exports = {
  async login(req, res, next) {
    try {
      // Aquisição e validação dos parâmetros
      const { email, password } = req.body;

      const rules = [
        [email, EmailValidator],
        [password, PasswordValidator],
      ];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        res.status(400).json(validationResult);
      }

      // Validação dos parâmetros finalizada, realiza procedimento de login
      const response = await AuthBusiness.login(email, password);

      // Retorna resultado da operação
      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async verifyAccount(req, res, next) {
    try {
      // Aquisição e validação dos parâmetros
      const userId = parseInt(req.query["id"]);
      const email = req.query["email"];
      const activationCode = req.query["code"];

      const rules = [
        [userId, UserIdValidator],
        [email, EmailValidator],
        [activationCode, ActivationValidator],
      ];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        res.status(400);
        return res.sendFile(path.resolve("./src/html/confirm_error.html"));
      }

      // Validação dos parâmetros finalizada
      const response = await AuthBusiness.verifyAccount(userId, email, activationCode);

      if (response.status === "error") {
        res.status(400);
        return res.sendFile(path.resolve("./src/html/confirm_error.html"));
      } else {
        res.status(200);
        return res.sendFile(path.resolve("./src/html/confirm_success.html"));
      }
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req, res, next) {
    try {
      return ok({
        message: "ok",
      });
    } catch (error) {
      next(error);
    }
  },
};
