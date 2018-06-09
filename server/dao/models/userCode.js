'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserCode = sequelize.define('UserCode', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    activatedAt: {
      type: DataTypes.DATE
    },
    ClientId: {
      type: DataTypes.INTEGER,
    },
    ServiceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    StaffUserId: {
      type: DataTypes.INTEGER
    },
    ShopId: {
      type: DataTypes.INTEGER
    }
    // LicenceKeyId: {
    //   type: DataTypes.INTEGER
    // },
  }, {});

  UserCode.associate = function(models) {
    UserCode.belongsTo(models.Service, {foreignKey: 'ServiceId', targetKey: 'id'});
    UserCode.belongsTo(models.Client, {foreignKey: 'ClientId', targetKey: 'id'});
    UserCode.belongsTo(models.Shop, {foreignKey: 'ShopId', targetKey: 'id'});
    UserCode.belongsTo(models.User, {foreignKey: {name: 'StaffUserId', as: 'StaffUserId'}, 
        targetKey: 'id', as: 'StaffUser'});
    UserCode.hasMany(models.LicenceKey, {as: 'LicenceKeys'});
    //UserCode.belongsTo(models.LicenceKey, {foreignKey: 'LicenceKeyId', targetKey: 'id'});
  };

  return UserCode;
};