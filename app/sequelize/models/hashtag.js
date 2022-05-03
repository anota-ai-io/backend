const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hashtag', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'hashtag',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "hashtag_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
