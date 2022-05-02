const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar um identificador de usuário");
    }

    if (input) {
      if (!validator.isAlphanumeric(input, "pt-BR")) {
        return validationError("O identificador de usuário não deve possuir caracteres especiais.");
      }

      if (
        !validator.isLength(input, {
          min: 3,
          max: 32,
        })
      ) {
        return validationError("O nome de usuário deve ter entre 3 e 32 caracteres.");
      }
    }

    return {};
  },
};
