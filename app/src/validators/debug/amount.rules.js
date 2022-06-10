const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar uma quantidade válida.");
    }

    if (input) {
      if (!validator.isInt(input.toString(), { min: 0 })) {
        return validationError("A quantidade válida deve ser um número inteiro positivo.");
      }
    }

    return {};
  },
};
