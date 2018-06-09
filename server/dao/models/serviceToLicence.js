'use strict';
module.exports = (sequelize, DataTypes) => {
  var ServiceToLicence = sequelize.define('ServiceToLicence', {
    Service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Licence_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {});
  
  return ServiceToLicence;
};