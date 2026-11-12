const { DataTypes } = require('sequelize');
const _TokenUrlMagic = require('./TokenUrlMagic');
const _Apikeys = require('./Apikeys');
const _Siebel = require('./Siebel');
const _Integraciones = require('./Integraciones');

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes);
  const Siebel = _Siebel(sequelize, DataTypes);
  const Integraciones = _Integraciones(sequelize, DataTypes);

  return {
    TokenUrlMagic,
    Apikeys,
    Siebel,
    Integraciones,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
