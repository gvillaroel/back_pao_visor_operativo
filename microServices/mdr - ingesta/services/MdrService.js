const db = require('../config/db');
const Schema = require('../models/init-models');
const {
  CreateIntegracion,
} = require('../repositories/IntegracionesRepository');

const { Mdr, EvAdress, EvGuest, EvOwners, PPurchase, ReceivedGift } =
  Schema.default(db);
const {
  SaveMdr,
  SavePPurchase,
  SaveReceivedGift,
  SaveEvAdress,
  SaveEvOwners,
  SaveEvGuest,
} = require('../repositories/MdrRepository');

exports.IngestaMdrService = async (req, res) => {
  const transa = await db.transaction();
  try {
    
    const integracion = {
      Sistema: 'MDR',
      JSONSistema: req.body,
      MessageType: 'Satelite MDR',
      OrderheaderKey: '001001',
      EstatusEjecucion: true,
    };
    await CreateIntegracion(integracion, transa);
    await transa.commit();
  } catch (error) {
    console.error('Error al grabar Integracion :', error);
    await transa.rollback();
    throw error;
  }
  // Inicia una nueva transacción
  const transaction = await db.transaction();
  try {
    console.log("Inicia Actualizacion de Tablas")    
    const body = req.body.result;
    const mdr = await GetInstanceMdr(body);
    await SaveMdr(mdr, transaction);
    for (key in body?.eventSummary?.personalPurchases) {
      const pPurchase = await GetInstancepPurchase(
        body?.eventSummary?.personalPurchases[key],
        body?.eventSummary?.eventId
      );
      await SavePPurchase(pPurchase, transaction);
    }

    for (key in body?.eventSummary?.receivedGifts) {
      const receivedGift = await GetInstanceReceivedGift(
        body?.eventSummary?.receivedGifts[key],
        body?.eventSummary?.eventId
      );
      await SaveReceivedGift(receivedGift, transaction);
    }

    for (key in body?.eventSummary?.eventAddresses) {
      const evAdress = await GetInstanceEvAdress(
        body?.eventSummary?.eventAddresses[key],
        body?.eventSummary?.eventId
      );
      await SaveEvAdress(evAdress, transaction);
    }

    for (key in body?.eventSummary?.eventOwners) {
      const evOwners = await GetInstanceEvOwners(
        body?.eventSummary?.eventOwners[key],
        body?.eventSummary?.eventId
      );
      await SaveEvOwners(evOwners, transaction);
    }

    for (key in body?.eventSummary?.eventGuests) {
      const evGuest = await GetInstanceEvGuest(
        body?.eventSummary?.eventGuests[key],
        body?.eventSummary?.eventId
      );
      await SaveEvGuest(evGuest, transaction);
    }
    await transaction.commit();
    return body;
  } catch (error) {
    console.error('Error ingesta de Mdr:', error.toString());
    await transaction.rollback();
    throw error;
  }
};

const GetInstanceMdr = async (body) => {
  const instance = new Mdr({
    eventId: body?.eventSummary?.eventId,
    eventStatus: body?.eventSummary?.eventStatus,
    creationStore: body?.eventSummary?.creationStore,
    expirationDate: body?.eventSummary?.expirationDate,
    preferredDeliveryDays: body?.eventSummary?.preferredDeliveryDays,
  });
  return instance.dataValues;
};

const GetInstancepPurchase = async (data, eventId) => {
  const instance = new PPurchase({
    remissionType: data?.remissionType,
    sku: data?.sku,
    price: data?.price,
    quantity: data?.quantity,
    deliveryMode: data?.deliveryMode,
    orderNumber: data?.orderNumber,
    mdr_eventId: eventId,
  });
  return instance.dataValues;
};

const GetInstanceReceivedGift = async (data, eventId) => {
  const instance = new ReceivedGift({
    remissionType: data?.remissionType,
    sku: data?.sku,
    price: data?.price,
    quantity: data?.quantity,
    deliveryMode: data?.deliveryMode,
    orderNumber: data?.orderNumber,
    mdr_eventId: eventId,
  });
  return instance.dataValues;
};

const GetInstanceEvAdress = async (data, eventId) => {
  const instance = new EvAdress({
    fullName: data?.fullName,
    street: data?.street,
    exteriorNumber: data?.exteriorNumber,
    zipCode: data?.zipCode,
    neighbourhood: data?.neighbourhood,
    delegationOrMunicipality: data?.delegationOrMunicipality,
    city: data?.city,
    mdr_eventId: eventId,
  });
  return instance.dataValues;
};

const GetInstanceEvOwners = async (data, eventId) => {
  const instance = new EvOwners({
    ownerLabel: data?.ownerLabel,
    fullName: data?.fullName,
    email: data?.email,
    mdr_eventId: eventId,
  });
  return instance.dataValues;
};

const GetInstanceEvGuest = async (data, eventId) => {
  const instance = new EvGuest({
    guestName: data?.guestName,
    email: data.email,
    mdr_eventId: eventId,
  });
  return instance.dataValues;
};
