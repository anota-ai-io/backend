const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postComment', {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'post',
        key: 'id'
      }
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'comment',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'postComment',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "postComment_pkey",
        unique: true,
        fields: [
          { name: "postId" },
          { name: "commentId" },
        ]
      },
    ]
  });
};
