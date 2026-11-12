const { DataTypes } = require('sequelize');
const _TokenUrlMagic = require('./TokenUrlMagic');
const _Apikeys = require('./Apikeys');
const _Mdr = require('./Mdr');
const _EvAdress = require('./EvAdress');
const _EvGuest = require('./EvGuest');
const _EvOwners = require('./EvOwners');
const _PPurchase = require('./PPurchase');
const _ReceivedGift = require('./ReceivedGift');

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const TokenUrlMagic = _TokenUrlMagic(sequelize, DataTypes);
  const Mdr = _Mdr(sequelize, DataTypes);
  const EvAdress = _EvAdress(sequelize, DataTypes);
  const EvGuest = _EvGuest(sequelize, DataTypes);
  const EvOwners = _EvOwners(sequelize, DataTypes);
  const PPurchase = _PPurchase(sequelize, DataTypes);
  const ReceivedGift = _ReceivedGift(sequelize, DataTypes);

  ReceivedGift.belongsTo(Mdr, { as: 'mdr_event', foreignKey: 'mdr_eventId' });
  EvAdress.belongsTo(Mdr, { as: 'mdr_event', foreignKey: 'mdr_eventId' });
  EvGuest.belongsTo(Mdr, { as: 'mdr_event', foreignKey: 'mdr_eventId' });
  EvOwners.belongsTo(Mdr, { as: 'mdr_event', foreignKey: 'mdr_eventId' });
  PPurchase.belongsTo(Mdr, { as: 'mdr_event', foreignKey: 'mdr_eventId' });

  Mdr.hasMany(ReceivedGift, { as: 'receivedGifts', foreignKey: 'mdr_eventId' });

  Mdr.hasMany(EvAdress, { as: 'eventAddresses', foreignKey: 'mdr_eventId' });

  Mdr.hasMany(EvGuest, { as: 'eventGuests', foreignKey: 'mdr_eventId' });

  Mdr.hasMany(EvOwners, { as: 'eventOwners', foreignKey: 'mdr_eventId' });

  Mdr.hasMany(PPurchase, {
    as: 'personalPurchases',
    foreignKey: 'mdr_eventId',
  });

  return {
    TokenUrlMagic,
    Apikeys,
    Mdr,
    ReceivedGift,
    EvAdress,
    EvGuest,
    EvOwners,
    PPurchase,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
