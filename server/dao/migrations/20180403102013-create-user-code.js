'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserCodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      used: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      activated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      activatedAt: {
        type: Sequelize.DATE
      },
      ClientId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Client',
          key: 'id',
          as: 'ClientId',
        }
      },
      StaffUserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id',
          as: 'StaffUserId',
        }
      },
      ServiceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Service',
          key: 'id',
          as: 'ServiceId',
        }
      },
      // LicenceKeyId: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      //   onDelete: 'CASCADE',
      //   references: {
      //     model: 'LicenceKey',
      //     key: 'id',
      //     as: 'LicenceKeyId',
      //   }
      // },
      //timestamps
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
    return queryInterface.dropTable('UserCodes');
  }
};