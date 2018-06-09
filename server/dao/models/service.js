'use strict';
module.exports = (sequelize, DataTypes) => {
  var Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    photo: {
      type: DataTypes.BLOB,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    fullPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {});
  
  Service.associate = function(models) {
    Service.belongsToMany(models.Licence, {
      through: models.ServiceToLicence,
      foreignKey: 'Service_id',
      as: 'Licences'
    });

    Service.hasMany(models.UserCode, {as: 'Codes'});
    // associations can be defined here
  };
  return Service;
};