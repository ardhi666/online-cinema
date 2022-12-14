'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      profile.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });
    }
  }
  profile.init({
    avatar: DataTypes.STRING,
    idUser: DataTypes.INTEGER,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    fullname: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'profile',
  });
  return profile;
};