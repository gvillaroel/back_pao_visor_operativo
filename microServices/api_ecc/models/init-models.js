const { DataTypes } = require('sequelize');
const _TokenUrlMagic = require('./TokenUrlMagic');
const _Apikeys = require('./Apikeys');
const _Ecc = require('./Ecc');

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes);
  const Ecc = _Ecc(sequelize, DataTypes);

  return {
    TokenUrlMagic,
    Apikeys,
    Ecc,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
