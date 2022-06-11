const { ok, badRequest } = require("../modules/http");
const { models } = require("../modules/sequelize");
const { Op } = require("sequelize");
const { OkStatus, ErrorStatus, IncorrectParameter } = require("../modules/codes");

module.exports = {
  async read(token, userId, username, email) {
    if (!userId && !username && !email) {
      return badRequest({
        status: ErrorStatus,
        code: IncorrectParameter,
        message: "Para buscar um perfil de usuário, informe um ID, nome de usuário ou email.",
      });
    }

    const user = await models.user.findOne({
      where: {
        [Op.or]: [
          {
            id: userId,
          },
          {
            username: username,
          },
        ],
      },
      raw: true,
    });

    if (user) {
      // Remover o campo de senha do retorno
      delete user["password"];
      delete user["activationCode"];

      // Adquirir os posts criados por esse usuário
      const posts = await models.post.findAll({
        attributes: ["id", "content", "createdAt"],
        include: [
          {
            model: models.user,
            as: "user",
            attributes: ["id", "name", "username", "profilePicture"],
            where: {
              username,
            },
          },
        ],
        order: [["createdAt", "desc"]],
        raw: true,
        nest: true,
      });

      // Percorre cada um dos posts retornados para obter mais informações sobre eles
      for (const post of posts) {
        // Adquire hashtags relacionadas a cada um dos posts
        const hashtags = await models.postHashtag.findAll({
          attributes: [],
          where: {
            postId: post["id"],
          },
          include: {
            model: models.hashtag,
            as: "hashtag",
            attributes: ["id", "name"],
          },
          raw: true,
          nest: true,
        });

        post["hashtags"] = [];
        for (const hashtag of hashtags) {
          post["hashtags"].push({ ...hashtag["hashtag"] });
        }

        // Adquire imagens relacionadas a cada um dos posts
        const images = await models.postImage.findAll({
          attributes: [],
          where: {
            postId: post["id"],
          },
          include: {
            model: models.image,
            as: "image",
            attributes: ["url"],
          },
          raw: true,
          nest: true,
        });

        post["images"] = [];
        for (const image of images) {
          post["images"].push(image["image"]["url"]);
        }

        // Adquire quantidade de likes para esse post
        const likes = await models.postLike.count({
          where: {
            postId: post["id"],
          },
          raw: true,
          nest: true,
        });

        post["likesCounter"] = likes;

        // Adquire quantidade de compartilhamentos para esse post
        const shares = await models.postShare.count({
          where: {
            postId: post["id"],
          },
          raw: true,
          nest: true,
        });

        post["sharesCounter"] = shares;

        // Adquire quantidade de downloads para esse post
        const downloads = await models.postDownload.count({
          where: {
            postId: post["id"],
          },
          raw: true,
          nest: true,
        });

        post["downloadsCounter"] = downloads;

        // Adquire quantidade de comentários para esse post
        const comments = await models.postComment.count({
          where: {
            postId: post["id"],
          },
          raw: true,
          nest: true,
        });

        post["commentsCounter"] = comments;

        // Verifica se esse usuário deu like nesse post
        const liked = await models.postLike.findOne({
          where: {
            postId: post["id"],
            userId,
          },
          raw: true,
        });

        post["liked"] = liked ? true : false;
      }

      return ok({
        status: OkStatus,
        response: {
          user,
          posts,
        },
      });
    } else {
      return notFound({
        status: ErrorStatus,
        code: UserNotFound,
        message: "Este usuário não foi encontrado.",
      });
    }
  },
};
