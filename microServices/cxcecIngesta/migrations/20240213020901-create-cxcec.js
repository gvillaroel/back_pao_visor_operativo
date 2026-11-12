'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS "cxcec" (
      "id" SERIAL PRIMARY KEY,
      "store" JSON,
      "order" JSON,
      "sku" JSON,
      "create_time" TIMESTAMP NOT NULL DEFAULT current_timestamp,
      "update_time" TIMESTAMP
      
  );`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    -- Up migration: Eliminar la tabla 
    DROP TABLE IF EXIST "cxcec";`);
  },
};
