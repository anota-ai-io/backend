const { DatabaseFailure } = require("../modules/codes");
const { failure, ok } = require("../modules/http");
const { models, sequelize } = require("../modules/sequelize");
const { base64Encode } = require("../modules/base64");
const fs = require("fs");

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

        console.log("Hashtags Criadas", hashtagsId);

        // 2 - Criar cada uma das imagens
        const imagesId = [];
        const imagesData = [];

        for (const imageContent of images) {
          const base64 = base64Encode(imageContent["path"]);

          const image = await models.image.create(
            {
              image: base64,
            },
            {
              transaction: t,
            }
          );

          imagesId.push(image["id"]);
          imagesData.push(base64);
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
