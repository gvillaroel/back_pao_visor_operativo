'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.query(`
    -- omsrback.configuraciones definition

    -- Drop table

    DROP TABLE IF EXISTS omsrback.configuraciones;

    CREATE TABLE omsrback.configuraciones (
      id_conf serial4 NOT NULL,
      modulo varchar(20) NOT NULL,
      configuracion jsonb NOT NULL,
      vigente bool NOT NULL,
      create_user varchar(500) NULL,
      create_time timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      update_user varchar(500) NULL,
      update_time timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT configuraciones_pkey PRIMARY KEY (id_conf)
    );`);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(`
    -- omsrback.configuraciones definition

    -- Drop table

    DROP TABLE IF EXISTS omsrback.configuraciones;`);
  }
};
