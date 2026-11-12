const { DataTypes } = require('sequelize');
const _TokenUrlMagic = require('./TokenUrlMagic');
const _Apikeys = require('./Apikeys');
const _Ewm = require('./Ewm');
const _Integraciones  = require('./integraciones');
function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes);
  const Ewm = _Ewm(sequelize, DataTypes);
  const Integraciones = _Integraciones(sequelize, DataTypes);

  return {
    TokenUrlMagic,
    Apikeys,
    Ewm,
    Integraciones
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
