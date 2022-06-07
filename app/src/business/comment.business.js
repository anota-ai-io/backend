const { models, sequelize } = require("../modules/sequelize");
const { ok, failure } = require("../modules/http");
const { ErrorStatus, OkStatus, DatabaseFailure } = require("../modules/codes");
const { COMMENTS_PAGE_SIZE } = require("../modules/constants");
const { CommentEmiter } = require("../modules/socket");

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

        // Modelo do retorno que deve ser enviado no socket para o frontend
        // É o mesmo modelo de retorno que é obtido quando um post é aberto
        // Caso seja alterado, consultar o retorno de post.business.read()

        // const retorno = {
        //   id: 22,
        //   content: "Testando comentário",
        //   createdAt: "2022-06-06T22:55:43.173Z",
        //   user: {
        //     id: 6,
        //     name: "Luan Petruits",
        //     username: "luanpetruitis",
        //     email: "luanpetruitis@hotmail.com",
        //     profilePicture:
        //       "https://firebasestorage.googleapis.com/v0/b/anotaaiifsp.appspot.com/o/uploads%2Fprofiles%2F227ea7130545f40715e5c8088b849a90?alt=media&token=b3357be3-1bdd-4ee7-9121-74346ec68c38",
        //   },
        // };

        const usuario = await models.user.findOne({
          attributes: ["id", "name", "username", "email", "profilePicture"],
          where: {
            id: userId,
          },
          raw: true,
        });

        const retornoSocket = {
          postId,
          id: comment.get()["id"],
          content: comment.get()["content"],
          createdAt: comment.get()["createdAt"],
          user: usuario,
        };

        // Disparar evento de novo comentário
        CommentEmiter.emit(`new_comment`, retornoSocket);

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
