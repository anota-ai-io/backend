const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postLike', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'post',
        key: 'id'
      }
    },
    udpatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    }
  }, {
    sequelize,
    tableName: 'postLike',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "postLike_pkey",
        unique: true,
        fields: [
          { name: "userId" },
          { name: "postId" },
        ]
      },
    ]
  });
};
