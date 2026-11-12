const { DataTypes } = require('sequelize');
const _TokenUrlMagic = require('./TokenUrlMagic');
const _Apikeys = require('./Apikeys');
const _Ecc = require('./Ecc');
const _Integraciones  = require('./integraciones')

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes);
  const Ecc = _Ecc(sequelize, DataTypes);
  const Integraciones = _Integraciones(sequelize, DataTypes)

  return {
    TokenUrlMagic,
    Apikeys,
    Ecc,
    Integraciones
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
