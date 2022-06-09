const { ErrorStatus, NotFound, OkStatus, DatabaseFailure } = require("../modules/codes");
const { ok, failure } = require("../modules/http");
const { models } = require("../modules/sequelize");

module.exports = {
  async create(userId, postId) {
    const post = await models.post.findOne({
      where: {
        id: postId,
      },
      raw: true,
      nest: true,
    });

    if (post) {
      const like = await models.postLike.findOrCreate({
        where: {
          postId,
          userId,
        },
        defaults: {
          postId,
          userId,
        },
      });

      const likesCounter = await models.postLike.count({
        where: {
          postId,
        },
        raw: true,
      });

      return ok({
        status: OkStatus,
        response: {
          message: "Operação de like registrada com sucesso.",
          post: {
            postId,
            likesCounter,
          },
        },
      });
    } else {
      return ok({
        status: ErrorStatus,
        response: {
          message: "O post informado não foi encontrado.",
        },
      });
    }
  },

  async delete(userId, postId) {
    const post = await models.post.findOne({
      where: {
        id: postId,
      },
      raw: true,
      nest: true,
    });

    if (post) {
      const deslike = await models.postLike.destroy({
        where: {
          postId,
          userId,
        },
      });

      const likesCounter = await models.postLike.count({
        where: {
          postId,
        },
        raw: true,
      });

      return ok({
        status: OkStatus,
        response: {
          message: "Operação de deslike registrada com sucesso.",
          post: {
            postId,
            likesCounter,
          },
        },
      });
    } else {
      return ok({
        status: ErrorStatus,
        response: {
          message: "O post informado não foi encontrado.",
        },
      });
    }
  },
};
