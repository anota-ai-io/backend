const PasswordValidator = require("../validators/user/password.rules");
const EmailValidator = require("../validators/user/email.rules");
const NameValidator = require("../validators/user/name.rules");
const UserIdValidator = require("../validators/user/id.rules");
const UserNameValidator = require("../validators/user/username.rules");
const OccupationValidator = require("../validators/user/occupation.rules");
const BioValidator = require("../validators/user/bio.rules");

const UserBusiness = require("../business/user.business");

const validation = require("../modules/validation");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição dos parâmetros
      const { name, email, password, username } = req.body;

      // Construir regras de validação
      const rules = [
        [name, NameValidator],
        [email, EmailValidator],
        [password, PasswordValidator],
        [username, UserNameValidator],
      ];

      // Validação dos parâmetros
      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      // Validação dos parâmetros finalizada
      const response = await UserBusiness.create(email, name, password, username);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const userId = parseInt(req.body["id"]);
      const { email, password } = req.body;

      const rules = [
        [userId, UserIdValidator],
        [email, EmailValidator],
        [password, PasswordValidator],
      ];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      // Execução da rotina
      const response = await UserBusiness.delete(token, userId, email, password);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async read(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const userId = parseInt(req.params["id"]);

      const rules = [[userId, UserIdValidator]];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await UserBusiness.read(token, userId);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async edit(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const { name, username, occupation, bio } = req.body;
      const profilePicture = req.file;

      console.log(profilePicture);

      const rules = [
        [name, NameValidator, { required: false }],
        [username, UserNameValidator, { required: false }],
        [occupation, OccupationValidator, { required: false }],
        [bio, BioValidator, { required: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await UserBusiness.edit(
        token,
        name,
        username,
        occupation,
        bio,
        profilePicture
      );

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
