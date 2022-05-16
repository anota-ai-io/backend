const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postShare', {
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
    tableName: 'postShare',
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
