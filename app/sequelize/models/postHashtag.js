const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postHashtag', {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'post',
        key: 'id'
      }
    },
    hashtagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'hashtag',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'postHashtag',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "postHashtag_pkey",
        unique: true,
        fields: [
          { name: "postId" },
          { name: "hashtagId" },
        ]
      },
    ]
  });
};
