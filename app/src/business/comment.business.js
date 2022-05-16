const { models, sequelize } = require("../modules/sequelize");
const { ok, failure } = require("../modules/http");
const { ErrorStatus, OkStatus, DatabaseFailure } = require("../modules/codes");
const { COMMENTS_PAGE_SIZE } = require("../modules/constants");

module.exports = {
  async create(userId, postId, content) {
    const post = models.post.findOne({
      where: {
        id: postId,
      },
      raw: true,
      nest: true,
    });

    if (post) {
      const result = await sequelize.transaction(async (t) => {
        // Criar o registro de comentário
        const comment = await models.comment.create(
          {
            userId,
            content,
          },
          {
            transaction: t,
          }
        );

        const commentId = comment.get()["id"];

        // Associar o registro de comentário com o post
        const postComment = await models.postComment.create(
          {
            postId,
            commentId,
          },
          {
            transaction: t,
          }
        );

        return comment.get();
      });

      if (result) {
        return ok({
          status: OkStatus,
          response: {
            comment: { ...result },
          },
        });
      } else {
        return failure({
          status: ErrorStatus,
          code: DatabaseFailure,
          message: "Não foi possível registrar o comentário.",
        });
      }
    } else {
      return ok({
        status: ErrorStatustus,
        response: {
          message: "O post informado não foi encontrado.",
        },
      });
    }
  },

  async list(postId, page) {
    if (!page || page == 0) page = 1;

    const post = models.post.findOne({
      where: {
        id: postId,
      },
      offset: (page - 1) * COMMENTS_PAGE_SIZE,
      limit: COMMENTS_PAGE_SIZE,
      raw: true,
      nest: true,
    });

    if (post) {
      const comments = await models.comment.findAll({
        attributes: ["id", "content", "createdAt"],
        include: [
          {
            model: models.user,
            as: "user",
            attributes: ["id", "name", "username"],
          },
          {
            model: models.postComment,
            required: true,
            as: "postComments",
            attributes: [],
            where: {
              postId,
            },
          },
        ],
        raw: true,
        nest: true,
      });

      return ok({
        status: OkStatus,
        response: {
          comments: comments,
        },
      });
    } else {
      return ok({
        status: ErrorStatustus,
        response: {
          message: "O post informado não foi encontrado.",
        },
      });
    }
  },
};
