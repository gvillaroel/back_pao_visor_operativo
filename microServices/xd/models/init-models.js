const { DataTypes } = require('sequelize');
const _TokenUrlMagic = require('./TokenUrlMagic');
const _Apikeys = require('./Apikeys');
const _Xd = require('./Xd');


function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes);
  const Xd = _Xd(sequelize, DataTypes);



  return {
    TokenUrlMagic,
    Apikeys,
    Xd
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
