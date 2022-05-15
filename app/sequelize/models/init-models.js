var DataTypes = require("sequelize").DataTypes;
var _comment = require("./comment");
var _hashtag = require("./hashtag");
var _image = require("./image");
var _post = require("./post");
var _postHashtag = require("./postHashtag");
var _postImage = require("./postImage");
var _postLike = require("./postLike");
var _refreshToken = require("./refreshToken");
var _user = require("./user");

function initModels(sequelize) {
  var user = _user(sequelize, DataTypes);
  var refreshToken = _refreshToken(sequelize, DataTypes);

  var post = _post(sequelize, DataTypes);

  var comment = _comment(sequelize, DataTypes);
  var hashtag = _hashtag(sequelize, DataTypes);
  var image = _image(sequelize, DataTypes);

  var postHashtag = _postHashtag(sequelize, DataTypes);
  var postImage = _postImage(sequelize, DataTypes);
  var postLike = _postLike(sequelize, DataTypes);

  hashtag.belongsToMany(post, {
    as: "postId_posts",
    through: postHashtag,
    foreignKey: "hashtagId",
    otherKey: "postId",
  });
  image.belongsToMany(post, {
    as: "postId_post_postImages",
    through: postImage,
    foreignKey: "imageId",
    otherKey: "postId",
  });
  post.belongsToMany(hashtag, {
    as: "hashtagId_hashtags",
    through: postHashtag,
    foreignKey: "postId",
    otherKey: "hashtagId",
  });
  post.belongsToMany(image, {
    as: "imageId_images",
    through: postImage,
    foreignKey: "postId",
    otherKey: "imageId",
  });
  post.belongsToMany(user, {
    as: "userId_users",
    through: postLike,
    foreignKey: "postId",
    otherKey: "userId",
  });
  user.belongsToMany(post, {
    as: "postId_post_postLikes",
    through: postLike,
    foreignKey: "userId",
    otherKey: "postId",
  });
  postHashtag.belongsTo(hashtag, { as: "hashtag", foreignKey: "hashtagId" });
  hashtag.hasMany(postHashtag, { as: "postHashtags", foreignKey: "hashtagId" });
  postImage.belongsTo(image, { as: "image", foreignKey: "imageId" });
  image.hasMany(postImage, { as: "postImages", foreignKey: "imageId" });
  comment.belongsTo(post, { as: "post", foreignKey: "postId" });
  post.hasMany(comment, { as: "comments", foreignKey: "postId" });
  postHashtag.belongsTo(post, { as: "post", foreignKey: "postId" });
  post.hasMany(postHashtag, { as: "postHashtags", foreignKey: "postId" });
  postImage.belongsTo(post, { as: "post", foreignKey: "postId" });
  post.hasMany(postImage, { as: "postImages", foreignKey: "postId" });
  postLike.belongsTo(post, { as: "post", foreignKey: "postId" });
  post.hasMany(postLike, { as: "postLikes", foreignKey: "postId" });
  comment.belongsTo(user, { as: "user", foreignKey: "userId" });
  user.hasMany(comment, { as: "comments", foreignKey: "userId" });
  post.belongsTo(user, { as: "user", foreignKey: "userId" });
  user.hasMany(post, { as: "posts", foreignKey: "userId" });
  postLike.belongsTo(user, { as: "user", foreignKey: "userId" });
  user.hasMany(postLike, { as: "postLikes", foreignKey: "userId" });
  refreshToken.belongsTo(user, { as: "user", foreignKey: "userId" });
  user.hasMany(refreshToken, { as: "refreshTokens", foreignKey: "userId" });

  return {
    comment,
    hashtag,
    image,
    post,
    postHashtag,
    postImage,
    postLike,
    refreshToken,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
