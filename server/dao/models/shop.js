'use strict';

module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define('Shop', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true
    },
    address: {
      type: DataTypes.STRING
    },
    AdminUserId: {
      type: DataTypes.INTEGER
    }
  });

  Shop.associate = (models) => {
    Shop.belongsToMany(models.User, {
      through: models.UserShop,
      foreignKey: 'Shop_id',
      as: 'users'
    });
    Shop.belongsTo(models.User, {foreignKey: {name: 'AdminUserId', as: 'AdminUserId'}, 
        targetKey: 'id', as: 'AdminUser'});
    Shop.hasMany(models.UserCode, {as: 'UserCodes'});
  };

  return Shop;
};