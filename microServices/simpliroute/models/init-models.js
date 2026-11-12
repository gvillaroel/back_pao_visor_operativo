const { DataTypes } = require('sequelize');
const _TokenUrlMagic = require('./TokenUrlMagic');
const _Apikeys = require('./Apikeys');
const _Simpliroute = require("./Simpliroute");


function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes);
  const Simpliroute = _Simpliroute(sequelize, DataTypes);



  return {
    TokenUrlMagic,
    Apikeys,
    Simpliroute
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
