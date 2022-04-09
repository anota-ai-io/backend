const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar um código de ativação.");
    }

    if (input) {
      if (!validator.isAlphanumeric(input)) {
        return validationError("O código de ativação informado não é válido.");
      }

      if (!validator.isLength(input, { min: 16, max: 16 })) {
        return validationError("O código de ativação informado não é válido.");
      }
    }

    return {};
  },
};
