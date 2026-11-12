const { DataTypes } = require('sequelize');
const _TokenUrlMagic = require('./TokenUrlMagic');
const _Apikeys = require('./Apikeys');
const _Cxcec = require('./Cxcec');

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes)
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes)
  const Cxcec = _Cxcec(sequelize, DataTypes)


  return {
    TokenUrlMagic,
    Apikeys,
    Cxcec,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
