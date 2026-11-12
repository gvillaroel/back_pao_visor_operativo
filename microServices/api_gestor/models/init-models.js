const { DataTypes } = require("sequelize");
const _TokenUrlMagic = require("./TokenUrlMagic");
const _Apikeys = require("./Apikeys");
const _Gestor = require("./Gestor");

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes);
  const Gestor = _Gestor(sequelize, DataTypes);

  return {
    TokenUrlMagic,
    Apikeys,
    Gestor,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
