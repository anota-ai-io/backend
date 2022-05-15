const validation = require("../modules/validation");

const PostBusiness = require("../business/post.business");

const ContentValidator = require("../validators/post/content.rules");
const HashtagValidator = require("../validators/post/hashtagh.rules");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição do Token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const userId = parseInt(token["id"]);

      // Aquisição dos parâmetros
      const { content } = req.body;
      const hashtags = req.body["hashtags"] ? JSON.parse(req.body.hashtags) : [];
      const images = req.files;

      // Construir regras de validação
      const rules = [
        [content, ContentValidator, { required: false }],
        [hashtags, HashtagValidator],
      ];

      // Validação dos parâmetros
      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      // Validação dos parâmetros finalizada
      const response = await PostBusiness.create(userId, content, hashtags, images);

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
