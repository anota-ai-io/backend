const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('download', {
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
    tableName: 'download',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "download_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
