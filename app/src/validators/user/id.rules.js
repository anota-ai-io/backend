const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar um ID de usuário.");
    }

    if (input) {
      if (!validator.isDecimal(input.toString())) {
        return validationError("O ID de usuário informado não é válido.");
      }
    }

    return {};
  },
};
