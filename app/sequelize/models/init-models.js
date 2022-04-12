var DataTypes = require("sequelize").DataTypes;
var _refreshToken = require("./refreshToken");
var _user = require("./user");

function initModels(sequelize) {
  var user = _user(sequelize, DataTypes);
  var refreshToken = _refreshToken(sequelize, DataTypes);

  refreshToken.belongsTo(user, { as: "user", foreignKey: "userId" });
  user.hasMany(refreshToken, { as: "refreshTokens", foreignKey: "userId" });

  return {
    refreshToken,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
