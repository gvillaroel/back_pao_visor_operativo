const Sequelize = require('sequelize');

// This code is for work in devmode locally
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    underscored: true,
    charset: "utf-8",
    timestamps: true,
    port: 5435,
    timezone: "America/Mexico_City",
    dialectOptions: {
      useUTC: false, // Desactiva el uso de UTC para la zona horaria
    },
    logging: false,
    replication: {
      read: [
        { host: process.env.DB_HOST_LECTURA, username: process.env.DB_USER, password: process.env.DB_PASS },
      ],
      write: { host: process.env.DB_HOST, username: process.env.DB_USER, password: process.env.DB_PASS },
    },
    pool: {
      max: 30, // Número máximo de conexiones en el pool.
      min: 10, // Número mínimo de conexiones en el pool.
      acquire: 60000, // Tiempo máximo (en milisegundos) que una conexión puede estar inactiva antes de ser liberada.
      idle: 10000, // Tiempo máximo (en milisegundos) que una conexión puede permanecer inactiva en el pool antes de ser desconectada.
    },
  }
);
module.exports = { sequelize };
