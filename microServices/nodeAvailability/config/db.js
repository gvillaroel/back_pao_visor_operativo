const Sequelize = require("sequelize");

const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5435;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: dbPort,
    dialect: "postgres",
    underscored: true,
    charset: "utf-8",
    timestamps: true,
    timezone: process.env.TIME_ZONE || "America/Mexico_City",
    dialectOptions: {
      useUTC: false,
    },
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  }
);

module.exports = { sequelize, Sequelize };
module.exports.default = sequelize;
module.exports.sequelize = sequelize;

