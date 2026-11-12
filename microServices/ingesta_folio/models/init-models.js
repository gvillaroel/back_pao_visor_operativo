const { DataTypes } = require('sequelize');
const _TokenUrlMagic = require('./TokenUrlMagic');
const _Apikeys = require('./Apikeys');
const _Integraciones = require('./integraciones')
const _OrdenVenta = require('./OrdenVenta')
const _Linea = require('./Linea')
const _Incidencia = require('./Incidencia')

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes)
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes)
  const Integraciones = _Integraciones(sequelize, DataTypes)
  const OrdenVenta = _OrdenVenta(sequelize, DataTypes)
  const Linea = _Linea(sequelize, DataTypes)
  const Incidencia = _Incidencia(sequelize, DataTypes)

  OrdenVenta.hasMany(Linea, { as: 'Lineas', foreignKey: 'OrderHeaderKey' });
  Linea.belongsTo(OrdenVenta, { as: "OrdenVenta", foreignKey: "OrderHeaderKey" });
  Incidencia.belongsTo(Linea, { as: "Linea", foreignKey: "OrderLineKey" });
  Linea.hasMany(Incidencia, { as: 'Incidencias', foreignKey: 'OrderLineKey' });

  return {
    TokenUrlMagic,
    Apikeys,
    Integraciones,
    OrdenVenta,
    Linea,
    Incidencia,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
