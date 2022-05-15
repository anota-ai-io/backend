const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar ao menos uma hashtag");
    }

    if (input) {
      if (!validator.isLength(input, { min: 3, max: 32 })) {
        return validationError("Cada hashtag deve ter entre 3 e 32 caracteres.");
      }

      if (
        !validator.isAlphanumeric(input, "pt-BR", {
          ignore: "-_",
        })
      ) {
        return validationError(
          "As hashtag não devem possuir caracteres especiais. Os únicos caracteres especiais permitidos são '-' e '_'"
        );
      }
    }

    return {};
  },
};
