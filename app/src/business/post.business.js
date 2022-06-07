const {
  DatabaseFailure,
  IncorrectParameter,
  ErrorStatus,
  OkStatus,
  NotFound,
} = require("../modules/codes");
const { failure, ok, badRequest, notFound } = require("../modules/http");
const { models, sequelize } = require("../modules/sequelize");
const { storage } = require("../services/firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

const fs = require("fs");

module.exports = {
  async create(userId, content, hashtags, images) {
    try {
      if (!content && images.length === 0) {
        return badRequest({
          status: ErrorStatus,
          code: IncorrectParameter,
          message:
            "Para criar um post, é necessário informar um conteúdo ou uma (ou mais) imagens.",
        });
      }

      const result = await sequelize.transaction(async (t) => {
        // 1 - Criar cada uma das hashtags
        const hashtagsId = [];

        for (const hashtagName of hashtags) {
          const hashtag = await models.hashtag.findOrCreate({
            where: {
              name: hashtagName,
            },
            defaults: {
              name: hashtagName,
            },
            transaction: t,
          });

          hashtagsId.push(hashtag[0]["dataValues"]["id"]);
        }

        console.log("Hashtags Criadas", hashtagsId);

        // 2 - Criar cada uma das imagens
        const imagesId = [];
        const imagesData = [];

        for (const imageContent of images) {
          const filename = imageContent["destination"] + imageContent["filename"];
          const storageRef = ref(storage, filename);
          const file = fs.readFileSync(filename);

          await uploadBytes(storageRef, file)
            .then(() => {
              console.log("Upload de arquivo no Firebase Storage executado com sucesso.");
            })
            .catch((error) => {
              console.log(`Falha no upload de arquivo no Firebase Storage: ${error.message}`);
              console.log(error);
            });

          await getDownloadURL(storageRef)
            .then(async (url) => {
              console.log("URL de arquivo obtida com sucesso");

              const image = await models.image.create(
                {
                  url: url,
                },
                {
                  transaction: t,
                }
              );

              imagesId.push(image["id"]);
              imagesData.push(url);
            })
            .catch((error) =>
              console.log(`Falha na aquisição de URL de arquivo: ${error.message}`)
            );
        }

        console.log("Imagens Criadas", imagesId);

        // 3 - Criar o post
        const post = await models.post.create(
          {
            userId,
            content,
          },
          {
            transaction: t,
          }
        );

        console.log("Post Criado", post["dataValues"]["id"]);

        // 4 - Associar as hashtags com o post
        for (const hashId of hashtagsId) {
          await models.postHashtag.create(
            {
              postId: post["dataValues"]["id"],
              hashtagId: hashId,
            },
            {
              transaction: t,
            }
          );
        }

        console.log("Hashtags Associadas");

        // 5 - Associar as imagens com o post
        for (const imgId of imagesId) {
          await models.postImage.create(
            {
              postId: post["dataValues"]["id"],
              imageId: imgId,
            },
            {
              transaction: t,
            }
          );
        }

        console.log("Imagens Associadas");

        return {
          id: post["dataValues"]["id"],
          userId,
          content,
          hashtags,
          images: [...imagesData],
        };
      });

      return ok({
        status: OkStatus,
        response: {
          post: {
            ...result,
          },
        },
      });
    } catch (error) {
      return failure({
        status: ErrorStatus,
        code: DatabaseFailure,
        message: `Falha na criação de post: ${error.message}`,
      });
    }
  },

  async list(page, userId, username, hashtag, hashtagId, content) {},

  async read(postId) {
    const post = await models.post.findOne({
      attributes: ["id", "content", "createdAt"],
      where: {
        id: postId,
      },
      include: [
        {
          model: models.user,
          as: "user",
          attributes: ["id", "name", "username", "profilePicture"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (post) {
      // Adquire hashtags relacionadas com o post
      const hashtags = await models.postHashtag.findAll({
        attributes: [],
        where: {
          postId,
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

      // Adquire imagens relacionadas com o post
      const images = await models.postImage.findAll({
        attributes: [],
        where: {
          postId,
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

      const comments = await models.comment.findAll({
        attributes: ["id", "content", "createdAt"],
        include: [
          {
            model: models.postComment,
            as: "postComments",
            required: true,
            attributes: [],
            where: {
              postId,
            },
          },
          {
            model: models.user,
            as: "user",
            attributes: ["id", "name", "username", "email", "profilePicture"],
          },
        ],

        raw: true,
        nest: true,
      });

      post["comments"] = comments;

      // Adquire quantidade de likes para esse post
      const likes = await models.postLike.count({
        where: {
          postId,
        },
        raw: true,
        nest: true,
      });

      post["likesCounter"] = likes;

      // Adquire quantidade de compartilhamentos para esse post
      const shares = await models.postShare.count({
        where: {
          postId,
        },
        raw: true,
        nest: true,
      });

      post["sharesCounter"] = shares;

      // Adquire quantidade de downloads para esse post
      const downloads = await models.postDownload.count({
        where: {
          postId,
        },
        raw: true,
        nest: true,
      });

      post["downloadsCounter"] = downloads;

      // Adquire quantidade de comentários para esse post
      const commentsCounter = await models.postComment.count({
        where: {
          postId,
        },
        raw: true,
        nest: true,
      });

      post["commentsCounter"] = commentsCounter;

      return ok({
        status: OkStatus,
        response: {
          post: { ...post },
        },
      });
    } else {
      return notFound({
        status: ErrorStatus,
        code: NotFound,
        message: "O Post informado não foi encontrado",
      });
    }
  },
};
