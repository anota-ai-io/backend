const DebugBusiness = require("../business/debug.business.js");
const validation = require("../modules/validation");
const AmountValidator = require("../validators/debug/amount.rules");

module.exports = {
  async feed(req, res, next) {
    try {
      // Aquisição do Token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const { amount } = req.query;
      const userId = parseInt(token["id"]);

      // // Construir regras de validação
      const rules = [[amount, AmountValidator]];

      // // Validação dos parâmetros
      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      // Validação dos parâmetros finalizada
      const response = await DebugBusiness.feed(userId, amount);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
