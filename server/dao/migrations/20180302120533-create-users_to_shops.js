'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ShopsToUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Shop_id: {
        type: Sequelize.INTEGER,
        //onDelete: 'CASCADE',
        references: {
          model: 'Shops',
          key: 'id',
          as: 'Shop_id',
        }
      },
      User_id: {
        type: Sequelize.INTEGER,
        //onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'User_id',
        }
      },
      // Timestamps
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
    return queryInterface.dropTable('ShopsToUsers');
  }
};