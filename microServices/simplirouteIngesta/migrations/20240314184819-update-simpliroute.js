'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('simpliroute', 'simpliroute_pkey');
    await queryInterface.renameColumn('simpliroute', 'id', 'old_id');
    await queryInterface.addColumn('simpliroute', 'id_simpliroute', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('simpliroute', 'id_simpliroute');
    await queryInterface.renameColumn('simpliroute', 'old_id', 'id');
    await queryInterface.addConstraint('simpliroute', {
      type: 'primary key',
      fields: ['id']
    });
  }
};

/*
  ALTER TABLE cnpao.simpliroute DROP CONSTRAINT simpliroute_pkey;
  ALTER TABLE cnpao.simpliroute DROP COLUMN id;
  ALTER TABLE cnpao.simpliroute ADD COLUMN id SERIAL PRIMARY KEY;
*/
