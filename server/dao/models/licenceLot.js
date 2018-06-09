'use strict';

import { getLogger } from '../../utils/logger';

const log = getLogger(module);

module.exports = (sequelize, DataTypes) => {
  const Licence = sequelize.import('./Licence');

  const LicenceLot = sequelize.define('LicenceLot', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    availableLicences: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0 
    },
    LicenceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    hooks: {
      afterUpdate: function(licenceLot, options) {
        if (licenceLot.changed('availableLicences') && licenceLot.get('availableLicences') === 0) {
          return updateLicencePrice(licenceLot, options);
        }
      },
      afterCreate: function(licenceLot, options) {
        return updateLicencePrice(licenceLot, options);
      },
      beforeCreate: (licenceLot, options) => {
        return setLicenceLotNumber(licenceLot, options)
      }
    }
  });

  LicenceLot.associate = (models) => {
    LicenceLot.belongsTo(models.Licence, {foreignKey: 'LicenceId', targetKey: 'id'});
    LicenceLot.hasMany(models.LicenceKey, {as: 'LicenceKeys'});
  };

  function setLicenceLotNumber(licenceLot, options) {
    return LicenceLot.findAll({
      where : {
        LicenceId: licenceLot.LicenceId
      },
      attributes: ['id'],
      transaction: options.transaction
    })
    .then( foundLicenceLots => {
      licenceLot.number = foundLicenceLots ? foundLicenceLots.length + 1 : 1;
    })
  }

  function updateLicencePrice(licenceLot, options) {
    return LicenceLot.findAll({
      where : {
        LicenceId: licenceLot.LicenceId
      },
      attributes: ['price'],
      order: [
        ['createdAt', 'ASC']
      ],
      limit: 1,
      transaction: options.transaction
    })
    .then( nextLotArr => {
      const newPrice = (nextLotArr && nextLotArr.length && nextLotArr[0].price) ? nextLotArr[0].price : 0;
      
      return Licence.update({price: newPrice}, {
        where: {
          id: licenceLot.LicenceId
        },
        transaction: options.transaction
      });
    })
    .catch(err => {
      log.error('Error has occured while updating Licence price.\n Licence ID: ' + licenceLot.LicenceId +
        '\nError: ' + err.message + '\nStack: ' + err.stack);
    });
  }

  // LicenceLot.createItem = (licenceLotData, trans) => {
  //   if ( !licenceLotData || !licenceLotData.number || !licenceLotData.LicenceId || !licenceLotData.price) {
  //     throw new Error('"licenceLotData" param should be an object with following required fields: ' + 
  //       '"number", "LicenceId", "price"');
  //   }

  //   return LicenceLot.create(licenceLotData, transaction: trans);
  // }

  return LicenceLot;
};