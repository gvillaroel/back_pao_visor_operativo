const { DataTypes } = require('sequelize');
const _TokenUrlMagic = require('./TokenUrlMagic');
const _Apikeys = require('./Apikeys');
const _Cxcec = require('./Cxcec');
const _Integraciones  = require('./integraciones')

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes)
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes)
  const Cxcec = _Cxcec(sequelize, DataTypes)
  const Integraciones = _Integraciones(sequelize, DataTypes)


  return {
    TokenUrlMagic,
    Apikeys,
    Cxcec,
    Integraciones
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
