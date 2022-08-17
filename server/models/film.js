'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      film.belongsTo(models.user, {
        as:"user",
        foreignKey:{
          name:"idUser"
        }
      })
      
      film.hasMany(models.transaction, {
        as: "transaction",
        foreignKey: {
          name: "idFilm",
        },
      });

      film.belongsToMany(models.category, {
        as: "categories",
        through: {
          model: "filmcategory",
          as: "bridge",
        },
        foreignKey: "idFilm",
      });
    }
  }
  film.init({
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    filmUrl: DataTypes.STRING,
    description: DataTypes.TEXT,
    thumbnail: DataTypes.STRING,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'film',
  });
  return film;
};