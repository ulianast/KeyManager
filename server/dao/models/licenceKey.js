'use strict';

//import LicenceLot from './LicenceLot';

module.exports = (sequelize, DataTypes) => {
  const LicenceLot = sequelize.import('./LicenceLot');

  var LicenceKey = sequelize.define('LicenceKey', {
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
    LicenceLotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    UserCodeId: {
      type: DataTypes.INTEGER
    }
  }, 
  {
    hooks: {
      afterUpdate: function(licenceKey, options) {
        if (licenceKey.changed('used')) {
          return LicenceLot.findById(licenceKey.LicenceLotId, {
            transaction: options.transaction
          })
          .then(licenceLot => {
            if (licenceKey.get('used')) {
              return licenceLot.decrement('availableLicences', {
                transaction: options.transaction 
              });
            }
            else {
              return licenceLot.increment('availableLicences', {
                transaction: options.transaction 
              });
            }
          });
        }
      }
    }
  });

  LicenceKey.associate = (models) => {
    LicenceKey.belongsTo(models.LicenceLot, {foreignKey: 'LicenceLotId', targetKey: 'id'});
    LicenceKey.belongsTo(models.UserCode, {foreignKey: 'UserCodeId', targetKey: 'id'});
  };

  return LicenceKey;
};