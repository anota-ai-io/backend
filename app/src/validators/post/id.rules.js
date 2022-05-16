const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar um Post ID.");
    }

    if (input) {
      if (
        !validator.isInt(input.toString(), {
          min: 0,
        })
      ) {
        return validationError("O Post ID informado não é válido.");
      }
    }

    return {};
  },
};
