const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postImage', {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'post',
        key: 'id'
      }
    },
    imageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'image',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'postImage',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "postImage_pkey",
        unique: true,
        fields: [
          { name: "postId" },
          { name: "imageId" },
        ]
      },
    ]
  });
};
