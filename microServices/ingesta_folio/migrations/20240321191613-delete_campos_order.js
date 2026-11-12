"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `ALTER TABLE orden_venta DROP FolioIncidencia, WorkOrderLink;`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TABLE orden_venta ADD COLUMN FolioIncidencia varchar(30);
    ALTER TABLE orden_venta ADD COLUMN WorkOrderLink varchar(100);
  `);
  },
};
