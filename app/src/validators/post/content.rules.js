const validator = require("validator");
const { validationError } = require("../../modules/validation");

module.exports = {
  validate(input, required) {
    if (!input && required) {
      return validationError("É necessário informar um conteúdo para o post");
    }

    if (input) {
      if (!validator.isLength(input, { max: 1000 })) {
        return validationError("O tamanho máximo para o conteudo do post é de 1000 caracteres.");
      }
    }

    return {};
  },
};
