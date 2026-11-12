'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS hanna (
      id_hanna SERIAL PRIMARY KEY,
      remision VARCHAR(50),
      fechaCompra DATE,
      fechaSolDev DATE,
      fechaDevApl DATE,
      usrAsesorSap VARCHAR(50),
      usrAdmonSap VARCHAR(50),
      tiendaOrigen VARCHAR(100),
      role_id INTEGER DEFAULT 1,
      tiendaRecon VARCHAR(100),
      evento VARCHAR(50),
      sku VARCHAR(50),
      piezas VARCHAR(50),
      precioUnit FLOAT,
      descuento FLOAT,
      totalCobro FLOAT,
      estatus VARCHAR(50),
      recogido VARCHAR(50),
      descEstatus VARCHAR(50),
      descMotivo VARCHAR(100),
      comentarios VARCHAR(100),
      boletaDev VARCHAR(20),
      idDevPaypal INTEGER,
      idVtaPaypal INTEGER,
      descCausa VARCHAR(100),
      descDCausa VARCHAR(100),
      descTipoDev VARCHAR(50),
      entEfecTda VARCHAR(50),
      refOpenPay VARCHAR(50),
      carrComp VARCHAR(50),
      bonMerc VARCHAR(50),
      promBonif VARCHAR(50),
      create_user VARCHAR(50),
      update_user VARCHAR(50),
      create_time TIMESTAMP NOT NULL DEFAULT current_timestamp,
      update_time TIMESTAMP
  );`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    -- Up migration: Eliminar la tabla 
    DROP TABLE IF EXIST hanna;`);
  },
};
