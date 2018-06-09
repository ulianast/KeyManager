'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ServiceToLicences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Service_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Services',
          key: 'id',
          as: 'Service_id',
        }
      },
      Licence_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Licences',
          key: 'id',
          as: 'Licence_id',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('ServiceToLicences');
  }
};