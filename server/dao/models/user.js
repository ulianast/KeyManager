'use strict';

import bcrypt from 'bcrypt';
import {getLogger} from '../../utils/logger';

const log = getLogger(module);

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true
    },
    fullName: {
      type: DataTypes.STRING
    },
    login: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    role: {
      type:   DataTypes.ENUM,
      values: ['seller', 'admin', 'super_admin', 'vendor']
    }
  }, {
    timestamps: true,
    hooks: {
      beforeSave: function(user) {
        if (user.changed('password')) {
          return bcrypt.hash(user.get('password'), 10)
            .then(success => {
              user.password = success;
            })
            .catch(err => {
              if (err) {
                log.error(`Error while hashing password for User with Username ${user.login}: ${err}`);
              }
            });
        }
      }
    }
  });

   /**
   * Compare the passed password with the value in the database. A model method.
   *
   * @param {string} password
   * @returns {object} callback
   */
  User.prototype.comparePassword = function comparePassword(password, callback) {
    bcrypt.compare(password, this.password, callback);
  };

  /**
   * Retrieves roles that user have access to assign to other users
   *
   * @returns {object} roles JSON map
   */
  User.prototype.getRoles = function getRoles() {
    if (! this.role || this.role === 'seller' || this.role === 'vendor') {
      return null;
    }

    const rolesMap = {};
    
    if (this.role === 'admin') {
      rolesMap.seller = User.getRoleLabel('seller');
    }
    else if (this.role === 'super_admin') {
      rolesMap.seller = User.getRoleLabel('seller');
      rolesMap.admin = User.getRoleLabel('admin');
      rolesMap.vendor = User.getRoleLabel('vendor');
    }

    return rolesMap;
  }

   /**
   * Retrieves role label in RUS
   *
   * @param {string} roleVal
   * @returns {string} roles label
   */
  User.getRoleLabel = function getRoleLabel(roleVal) {
    let label = '';

    if (roleVal) { 
      switch(roleVal) {
        case 'seller':
          label = 'Продавец';
          break;
        case 'admin':
          label = 'Администратор сети';
          break;
        case 'vendor':
          label = 'Вендор';
          break;
        case 'super_admin':
          label = 'Супер Администратор';
          break;
      }
    }

    return label;
  }

  /**
   * Set Many-To-Many realation with Shops model through UserShops table
   *
   * @param {models} Sequelize Models collection
   */
  User.associate = (models) => {
    User.belongsToMany(models.Shop, {
      through: models.UserShop,
      foreignKey: 'User_id',
      as: 'shops'
    });

    User.hasMany(models.UserCode, {as: 'UserCodes', foreignKey: 'StaffUserId'});
    User.hasOne(models.Shop, {as: 'ShopWhereAdmin', foreignKey: 'AdminUserId'});
  };

  return User;
};
