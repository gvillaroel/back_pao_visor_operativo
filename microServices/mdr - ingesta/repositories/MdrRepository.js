/* eslint-disable camelcase */
const db = require('../config/db');
const Schema = require('../models/init-models');
const configlog4 = require('../log4js.json');
const log4js = require('log4js');

log4js.configure(configlog4);

const {
  ReceivedGift,
  Mdr,
  PPurchase,
  EvAdress,
  EvGuest,
  EvOwners
} = Schema.default(db);

exports.SaveMdr = async (mdr, t) => {
  const save = await Mdr.create(mdr, { transaction: t });
  return save;
};

exports.SavePPurchase = async (purchase, t) => {
  const save = await PPurchase.create(purchase, { transaction: t });
  return save;
};

exports.SaveReceivedGift = async (receivedGift, t) => {
  const save = await ReceivedGift.create(receivedGift, { transaction: t });
  return save;
};
exports.SaveEvAdress = async (evAdress, t) => {
  const save = await EvAdress.create(evAdress, { transaction: t });
  return save;
};

exports.SaveEvOwners = async (evOwners, t) => {
  const save = await EvOwners.create(evOwners, { transaction: t });
  return save;
};

exports.SaveEvGuest = async (evGuest, t) => {
  const save = await EvGuest.create(evGuest, { transaction: t });
  return save;
};
