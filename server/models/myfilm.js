'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class myFilm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      myFilm.belongsTo(models.film,{
        as:"film",
        foreignKey:{
          name:"idFilm"
        }
      })
    }
  }
  myFilm.init({
    idUser: DataTypes.INTEGER,
    idFilm: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'myFilm',
  });
  return myFilm;
};