const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('refreshToken', {
    id: {
      type: DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    iat: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    exp: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'refreshToken',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "refreshToken_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
