'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true
      },
      fullName: {
        type: Sequelize.STRING
      },
      // middleName: {
      //   type: Sequelize.STRING
      // },
      // lastName: {
      //   type: Sequelize.STRING
      // },
      login: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM,
        values: ['seller', 'admin', 'super_admin', 'vendor']
      },
      // Timestamps
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        //defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        //defaultValue: Sequelize.NOW
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Users');
  }
};