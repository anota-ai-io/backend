const validation = require("../modules/validation");

const PostBusiness = require("../business/post.business");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição do Token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const userId = parseInt(token["id"]);

      // Aquisição dos parâmetros
      const { content, hashtags, images } = req.body;

      // Construir regras de validação
      // const rules = [
      //   [content, NameValidator],
      //   [hashtags, EmailValidator],
      //   [images, ImageValidator],
      // ];

      // // Validação dos parâmetros
      // const validationResult = validation.run(rules);

      // if (validationResult["status"] === "error") {
      //   return res.status(400).json(validationResult);
      // }

      // Validação dos parâmetros finalizada
      const response = await PostBusiness.create(userId, content, hashtags, images);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
