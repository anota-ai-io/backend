const { models, sequelize } = require("../modules/sequelize");

const { ok } = require("../modules/http");
const { OkStatus } = require("../modules/codes");
const { FEED_PAGE_SIZE } = require("../modules/constants");
const { base64Encode } = require("../modules/base64");

module.exports = {
  async get(userId, page) {
    if (!page || page == 0) page = 1;

    // Adquire lista de Posts
    const posts = await models.post.findAll({
      attributes: ["id", "content", "createdAt"],
      include: [
        {
          model: models.user,
          as: "user",
          attributes: ["id", "name", "username"],
        },
      ],
      offset: (page - 1) * FEED_PAGE_SIZE,
      limit: FEED_PAGE_SIZE,
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

      // Versão antiga, com upload bia bytea e base64
      // post["images"] = [];
      // for (const image of images) {
      //   console.log(image);
      //   // const base64 = base64Encode(imageContent["destination"] + imageContent["filename"]);
      //   const base64 = image["image"]["image"].toString("base64");
      //   post["images"].push(base64);
      // }
    }

    return ok({
      status: OkStatus,
      response: {
        posts: posts,
      },
    });
  },
};
