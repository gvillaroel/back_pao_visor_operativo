'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS omsrback.frecuencia (
      id_frecuencia SERIAL PRIMARY KEY,
      codigo_postal VARCHAR(10) NOT NULL,
      estado VARCHAR(50),
      municipio VARCHAR(100),
      asentamiento VARCHAR(100),
      tipo_asentamiento VARCHAR(50),
      id_ubicacion_bt VARCHAR(10) NOT NULL,
      nombre_ubicacion VARCHAR(100),
      frecuencia_bt VARCHAR(10),
      dias_frecuencia_bt VARCHAR(100),
      fletero_externo BOOLEAN,
      tipo_ruta VARCHAR(50),
      tipo_zona VARCHAR(50),
      macroruta VARCHAR(100),
      periodicidad VARCHAR(20) NOT NULL,
      key_periodicidad VARCHAR(20) NOT NULL,
      create_user VARCHAR(50),
      update_user VARCHAR(50),
      create_time TIMESTAMP NOT NULL DEFAULT current_timestamp,
      update_time TIMESTAMP
  );
  `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    -- Up migration: Eliminar la tabla 
    DROP TABLE IF EXIST omsrback.frecuencia;`);
  },
};
