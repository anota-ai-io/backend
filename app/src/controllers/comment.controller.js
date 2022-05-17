const validation = require("../modules/validation");

const CommentBusiness = require("../business/comment.business");

const ContentValidator = require("../validators/comment/content.rules");
const PostIdValidator = require("../validators/post/id.rules");

module.exports = {
  async create(req, res, next) {
    try {
      // Aquisição do Token
      const { token } = req;

      // Aquisição e validação de parâmetros
      const userId = parseInt(token["id"]);
      const postId = parseInt(req.body["postId"]);

      // Aquisição dos parâmetros
      const { content } = req.body;

      // Construir regras de validação
      const rules = [
        [postId, PostIdValidator],
        [content, ContentValidator],
      ];

      // Validação dos parâmetros
      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      // Validação dos parâmetros finalizada
      const response = await CommentBusiness.create(userId, postId, content);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async list(req, res, next) {
    try {
      // Aquisição e validação de parâmetros
      const postId = parseInt(req.query["postId"]);
      const page = parseInt(req.query["page"]);

      // Construir regras de validação
      const rules = [[postId, PostIdValidator]];

      // Validação dos parâmetros
      const validationResult = validation.run(rules);

      if (validationResult["status"] === "error") {
        return res.status(400).json(validationResult);
      }

      // Validação dos parâmetros finalizada
      const response = await CommentBusiness.list(postId, page);

      return res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
