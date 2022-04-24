const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar um refresh token válido.");
    }

    if (input) {
      if (
        !validator.isLength(input, {
          min: 128,
          max: 128,
        })
      ) {
        return validationError("O refresh token informado não possui o comprimento esperado.");
      }

      if (!validator.isHexadecimal(input)) {
        return validationError("O refresh token informado não atende o padrão esperado.");
      }
    }

    return {};
  },
};
