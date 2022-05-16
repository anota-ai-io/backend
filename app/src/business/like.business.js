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

      if (like) {
        return ok({
          status: OkStatus,
          response: {
            message: "Operação de like registrada com sucesso.",
          },
        });
      } else {
        return failure({
          status: ErrorStatus,
          code: DatabaseFailure,
          message: "Não foi possível registrar a operação de like.",
        });
      }
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
      const like = await models.postLike.destroy({
        where: {
          postId,
          userId,
        },
      });

      if (like) {
        return ok({
          status: OkStatus,
          response: {
            message: "Operação de deslike registrada com sucesso.",
          },
        });
      } else {
        return failure({
          status: ErrorStatus,
          code: DatabaseFailure,
          message: "Não foi possível registrar a operação de deslike.",
        });
      }
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
