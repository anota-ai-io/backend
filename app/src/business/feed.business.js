const { models } = require("../modules/sequelize");
const { ok } = require("../modules/http");
const { OkStatus } = require("../modules/codes");
const { FEED_PAGE_SIZE } = require("../modules/constants");

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
          attributes: ["id", "name", "username", "profilePicture"],
        },
      ],
      order: [["createdAt", "desc"]],
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
    }

    return ok({
      status: OkStatus,
      response: {
        posts: posts,
      },
    });
  },
};
