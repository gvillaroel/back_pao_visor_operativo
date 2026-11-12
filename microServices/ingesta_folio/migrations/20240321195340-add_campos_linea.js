"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TABLE linea ADD WorkOrderID varchar(30);
    ALTER TABLE linea ADD WorkOrderLink varchar(100);
  `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE linea DROP WorkOrderID, WorkOrderLink;`
    );
  },
};
