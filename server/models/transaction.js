'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.belongsTo(models.user,{
        as:"seller",
        foreignKey:{
          name:"idSeller"
        }
      }),
      transaction.belongsTo(models.user,{
        as:"buyer",
        foreignKey:{
          name:"idBuyer"
        }
      }),
      transaction.belongsTo(models.film,{
        as:"film",
        foreignKey:{
          name:"idFilm"
        }
      })
    }
  }
  transaction.init({
    idFilm: DataTypes.INTEGER,
    idBuyer: DataTypes.INTEGER,
    idSeller: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};