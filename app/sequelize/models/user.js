const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    activationCode: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    occupation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
