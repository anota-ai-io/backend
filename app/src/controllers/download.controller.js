const validation = require("../modules/validation");

const DownloadBusiness = require("../business/download.business");

const PostIdValidator = require("../validators/post/id.rules");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição do Token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const userId = parseInt(token["id"]);

      // Aquisição dos parâmetros
      const postId = parseInt(req.body.postId);

      // Construir regras de validação
      const rules = [[postId, PostIdValidator]];

      // Validação dos parâmetros
      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      // Validação dos parâmetros finalizada
      const response = await DownloadBusiness.create(userId, postId);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
