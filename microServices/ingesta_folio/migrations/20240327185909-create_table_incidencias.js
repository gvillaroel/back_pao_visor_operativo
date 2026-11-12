'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS cnpao.incidencias (
          "Id" SERIAL PRIMARY KEY,
          "Sku"   VARCHAR(50),
          "Title" VARCHAR(255),
          "Category" VARCHAR(100),
          "Resolutor" VARCHAR(100),
          "Description" VARCHAR(255),
          "Solicitante"  VARCHAR(100),
          "SubCategory" VARCHAR(100),
          "WorkOrderID" VARCHAR(50),
          "FechaDeStatus" VARCHAR(50),
          "WorkOrderLink" VARCHAR(255),
          "CorreoResolutor" VARCHAR(255),
          "CreatedDateTime" VARCHAR(50),
          "EquipoResolutor" VARCHAR(50),
          "WorkOrderStatus" VARCHAR(50),
          "CloseDescription" VARCHAR(255),
          "CorreoSolicitante" VARCHAR(255),
          "LocacionResolutor" VARCHAR(50),  
          "ExpectedCompletionDate" VARCHAR(50),
          "DescripcionLocacionResolutor" VARCHAR(255),
          "OrderLineKey" NUMERIC REFERENCES cnpao.linea("OrderLineKey"),
          "FchCreacion" TIMESTAMP NOT NULL DEFAULT current_timestamp,
          "FchActualizacion" TIMESTAMP
      );`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    -- Up migration: Eliminar la tabla 
    DROP TABLE IF EXIST incidencias;`);
  }
};
