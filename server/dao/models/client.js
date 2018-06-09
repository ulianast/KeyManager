'use strict';
module.exports = (sequelize, DataTypes) => {
  var Client = sequelize.define('Client', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        is: /\+?(\d+-?\s?\(?\)?)+/
      },
      unique: true
    }
  }, {});

  Client.associate = function(models) {
    // associations can be defined here
    Client.hasMany(models.UserCode, {as: 'Codes'});
  };

  return Client;
};