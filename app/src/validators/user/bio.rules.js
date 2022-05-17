const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar um texto para a bio.");
    }

    if (input) {
      if (
        !validator.isLength(input, {
          min: 3,
          max: 255,
        })
      ) {
        return validationError("O texto de bio deve ter entre 3 e 255 caracteres.");
      }
    }

    return {};
  },
};
