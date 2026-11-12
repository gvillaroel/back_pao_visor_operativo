/* eslint-disable max-len */
const Sequelize = require("sequelize");

const BrokerReadPool = new Sequelize(
  process.env.DB_NAME,
  null,
  null,
  {
    dialect: "postgres",
    underscored: true,
    charset: "utf-8",
    timestamps: true,
    timezone: "America/Mexico_City",
    dialectOptions: {
      useUTC: false, // Desactiva el uso de UTC para la zona horaria
    },
    logging: (msg) => console.log(`Sequelize Log: ${msg}`),
    replication: {
      read: [{ host: process.env.DB_HOST_BROCKER, username: process.env.DB_USER, password: process.env.DB_PASS }],
      write: { host: process.env.DB_HOST_BROCKER, username: process.env.DB_USER, password: process.env.DB_PASS },
    },
  },
);

module.exports = { BrokerReadPool };
