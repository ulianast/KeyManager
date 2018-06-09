'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
        fullName: 'John Super Doe',
        role: 'super_admin',
        login: 'super_admin',
        password: '$2a$10$1g2U19RBNwzyep.qbmJ4EeLa1qbqf5Vd0Dy.CmWFnYlko4gNfL8Wu', 
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', { where: {login: 'super_admin'}});
  }
};
