const EmailValidator = require("../validators/user/email.rules");
const NameValidator = require("../validators/user/name.rules");
const UserIdValidator = require("../validators/user/id.rules");
const UserNameValidator = require("../validators/user/username.rules");
const OccupationValidator = require("../validators/user/occupation.rules");
const BioValidator = require("../validators/user/bio.rules");

const ProfileBusiness = require("../business/profile.business");

const validation = require("../modules/validation");

module.exports = {
  async read(req, res, next) {
    try {
      // Aquisição do token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const userId = parseInt(req.params["id"]) || 0;
      const { username, email } = req.query;

      const rules = [
        [userId, UserIdValidator, { required: false }],
        [username, UserNameValidator, { required: false }],
        [email, EmailValidator, { required: false }],
      ];

      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      const response = await ProfileBusiness.read(token, userId, username, email);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
