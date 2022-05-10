const { DatabaseFailure } = require("../modules/codes");
const { failure, ok } = require("../modules/http");
const { models, sequelize } = require("../modules/sequelize");

module.exports = {
  async create(userId, content, hashtags, images) {
    try {
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

        // 2 - Criar cada uma das imagens
        const imagesId = [];

        for (const imageContent of images) {
          const image = await models.image.create(
            {
              image: imageContent,
            },
            {
              transaction: t,
            }
          );

          imagesId.push(image["id"]);
        }

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

        return {
          id: post["dataValues"]["id"],
          userId,
          content,
          hashtags,
          images,
        };
      });

      return ok({
        status: "ok",
        response: {
          post: {
            ...result,
          },
        },
      });
    } catch (error) {
      return failure({
        status: "error",
        code: DatabaseFailure,
        message: `Falha na criação de post: ${error.message}`,
      });
    }
  },
};
