const validation = require("../modules/validation");

const FeedBusiness = require("../business/feed.business");

module.exports = {
  async get(req, res, next) {
    try {
      // Aquisição do Token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const userId = parseInt(token["id"]);

      // Aquisição dos parâmetros
      const { page } = req.query;

      // // Construir regras de validação
      // const rules = [
      //   [content, ContentValidator, { required: false }],
      //   [hashtags, HashtagValidator],
      // ];

      // // Validação dos parâmetros
      // const validationResult = validation.run(rules);

      // if (validationResult["status"] === "error") {
      //   return res.status(400).json(validationResult);
      // }

      // Validação dos parâmetros finalizada
      const response = await FeedBusiness.get(userId, page);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  list(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  },
};
