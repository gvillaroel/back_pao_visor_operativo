const { DataTypes } = require("sequelize");
const _TokenUrlMagic = require("./TokenUrlMagic");
const _Apikeys = require("./Apikeys");
const _Integraciones = require("./integraciones");
const _Hanna = require("./S4Hanna");

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes);
  const Integraciones = _Integraciones(sequelize, DataTypes);
  const S4Hanna = _Hanna(sequelize, DataTypes);
  return {
    TokenUrlMagic,
    Apikeys,
    Integraciones,
    S4Hanna,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
