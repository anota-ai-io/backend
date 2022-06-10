const { models } = require("../modules/sequelize");
const { ok } = require("../modules/http");

module.exports = {
  async aquirePost(userId, id) {
    const post = await models.post.findOne({
      attributes: ["id", "content", "createdAt"],
      where: {
        id,
      },
      include: [
        {
          model: models.user,
          as: "user",
          attributes: ["id", "name", "username", "profilePicture"],
        },
      ],
      order: [["createdAt", "desc"]],
      raw: true,
      nest: true,
    });

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

    return post;
  },

  async feed(userId, amount) {
    const firstPostId = 131;
    const dummyPostId = 130;
    const lastPostId = 129;

    const firstPost = await this.aquirePost(userId, firstPostId);
    const duymmyPost = await this.aquirePost(userId, dummyPostId);
    const lastPost = await this.aquirePost(userId, lastPostId);

    let finalPosts = [];

    finalPosts.push(firstPost);
    for (let i = 0; i < amount; i++) {
      finalPosts.push(duymmyPost);
    }
    finalPosts.push(lastPost);

    return ok({
      response: {
        posts: finalPosts,
      },
    });
  },
};
