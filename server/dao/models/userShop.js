'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserShop = sequelize.define('UserShop', {
    User_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  });

  return UserShop;
};