/* eslint-disable consistent-return */
const log4js = require('log4js');
const db = require('../config/db');
const Schema = require('../models/init-models');

const Token = Schema.default(db).TokenUrlMagic;

const config = require('../log4js.json');

log4js.configure(config);
const logger = log4js.getLogger('TokenUrlMagicRepository');

exports.FetchAll = async () => {
  const menu = await Token.findAll({
    where: { activo: 1 },
    // order: [["nombre"]],
  });
  return menu;
};

exports.FetchOne = async (vToken) => {
  const tokenreg = await Token.findOne({
    where: { id_token: vToken.id },
  });

  return tokenreg;
};

exports.FetchOnebyId = async (id) => {
  const tokenreg = await Token.findOne({
    where: { id_token: id },
  });

  return tokenreg;
};

exports.FetchOnebyToken = async (token) => {
  const tokenreg = await Token.findOne({
    where: { token },
  });

  return tokenreg;
};

exports.Create = async (vToken) => {
  try {
    const newReg = await Token.create(vToken);
    return newReg;
  } catch (e) {
    logger.error(e);
  }
};

exports.Update = async (token, id) => {
  const vToken = token;
  vToken.update_time = new Date();
  const regUpdated = await Token.update(vToken, {
    where: { id_token: id },
  });
  return regUpdated;
};

exports.disableToken = async (id) => {
  const regUpdated = await Token.update(
    { activo: 0, update_time: new Date() },
    {
      where: { id_token: id },
    }
  );
  return regUpdated;
};
