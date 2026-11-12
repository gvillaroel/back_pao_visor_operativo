'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS siebel(
      id serial PRIMARY KEY,
    strDirContacto Varchar(100),
    strNombreContacto Varchar(100),
    strFecApertura Varchar(50),
    strUltimaModificacion Varchar(50),
    strActualizadoPor Varchar(50),
    strResumen Varchar(100),
    strTipoLlamada Varchar(20),
    strFecCierre jsonb,
    strFecCompromiso Varchar(50),
    strCreadoPor Varchar(50),
    strDetalle Varchar(100),
    strCategoria Varchar(50),
    strArea Varchar(50),
    strSubcategoria Varchar(20),
    strEdoGarantia Varchar(20),
    strModelo Varchar(50),
    strProveedor Varchar(50),
    strMarca jsonb,
    strMotivoCancelacion jsonb,
    strMotivoCierre Varchar(100),
    strTelContacto Varchar(20),
    strEmailContacto Varchar(20),
    strGrupo Varchar(20),
    strSKU Varchar(50),
    strDescripcionSKU Varchar(100),
    strOrdenVenta Varchar(50),
    strSolucion jsonb,
    strFechaSol jsonb,
    strMotivoSolucion jsonb,
    strSubMotivoSolucion jsonb,
    strMedioContacto Varchar(50),
    strSubEdo Varchar(20),
    strTicketCompra Varchar(50),
    strTipoCategoria Varchar(20),
    strPropietario Varchar(20),
    strPrioridad Varchar(20),
    strFecCompra Varchar(50),
    strAlmacenCompra Varchar(50),
    strIdSS Varchar(20),
    strNoSS Varchar(20),
    strNumSerie jsonb,
    strFecEntrega Varchar(50),
    strStatusSS Varchar(50),
    fcreacion timestamptz,
    factualizacion timestamptz,
    create_time TIMESTAMP NOT NULL DEFAULT current_timestamp,
    update_time TIMESTAMP
    );`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    -- Up migration: Eliminar la tabla
    DROP TABLE IF EXIST siebels;`);
  },
};
