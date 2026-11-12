/* eslint-disable max-len */
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    underscored: true,
    charset: "utf-8",
    port: process.env.DB_PORT || 5432,
    timestamps: true,
    timezone: "America/Mexico_city",
    logging: false,
    pool: {
      max: 500, // Número máximo de conexiones en el pool.
      min: 10, // Número mínimo de conexiones en el pool.
      acquire: 60000, // Tiempo máximo (en milisegundos) que una conexión puede estar inactiva antes de ser liberada.
      idle: 10000, // Tiempo máximo (en milisegundos) que una conexión puede permanecer inactiva en el pool antes de ser desconectada.
    },
  },
);

// Sincroniza modelos y crea tablas y relaciones
/* sequelize.sync().then(() => {
    console.log('Tablas y relaciones sincronizadas con éxito.');
}).catch((error) => {
  console.error('Error al sincronizar tablas y relaciones:', error);
}); */

module.exports = sequelize;
