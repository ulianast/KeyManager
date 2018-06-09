'use strict';

module.exports = (sequelize, DataTypes) => {
  const Licence = sequelize.define('Licence', {
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    cardImage: {
      type: DataTypes.BLOB
    },
    activationSteps: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    }
    // providerContact: {
    //   type: DataTypes.TEXT,
    //   allowNull: false
    // }
  });

  Licence.associate = (models) => {
    Licence.belongsToMany(models.Service, {
      through: models.ServiceToLicence,
      foreignKey: 'Licence_id',
      as: 'services'
    });

    Licence.hasMany(models.LicenceLot, {as: 'LicenceLots'});
  };

  return Licence;
};