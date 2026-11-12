const { DataTypes } = require("sequelize");
const _TokenUrlMagic = require("./TokenUrlMagic");
const _Apikeys = require("./Apikeys");
const _S4Hanna = require("./S4Hanna");

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes);
  const S4Hanna = _S4Hanna(sequelize, DataTypes);

  return {
    TokenUrlMagic,
    Apikeys,
    S4Hanna,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
