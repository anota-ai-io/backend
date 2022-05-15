const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('share', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'post',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'share',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "share_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
