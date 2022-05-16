const { ErrorStatus, OkStatus, DatabaseFailure } = require("../modules/codes");
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
      const download = await models.postShare.create({
        postId,
        userId,
      });

      if (download) {
        return ok({
          status: OkStatus,
          response: {
            message: "Operação de compartilhamento registrada com sucesso.",
          },
        });
      } else {
        return failure({
          status: ErrorStatus,
          code: DatabaseFailure,
          message: "Não foi possível registrar a operação de compartilhamento.",
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
