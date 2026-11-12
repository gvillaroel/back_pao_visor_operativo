const db = require('../config/db');
const Schema = require('../models/init-models');
const { Cxcec } = Schema.default(db);
const {
  SaveCxcec,
  FetchCxcecByID,
  updateCxcec,
} = require('../repositories/CxcecRepository');
const log4js = require('log4js');
const configlog4 = require('../log4js.json');
log4js.configure(configlog4);
const logger = log4js.getLogger('CxcecServices');
exports.InsertCxcec = async (payload) => {
  logger.info('En metodo persistir tabla CXCEC');
  try {
    const orderId = payload.data?.order?.orderId;
    const cxcec = await FetchCxcecByID(orderId);
    if (cxcec !== null) {
      const upCxcec = await GetInstanceCxcec(payload.data, cxcec);
      await updateCxcec(upCxcec, orderId);
    } else {
      const newCxcec = await SaveCxcec(payload.data);
      if (newCxcec !== null) {
        logger.info('Insert on CXCEC Table');
      } else {
        logger.info('Fail on Insert CXCEC');
      }
    }
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const GetInstanceCxcec = async (data, cxcec) => {
  if (!data.store?.zone) {
    data.store.zone = cxcec.store?.zone;
  }
  if (!data.store?.name) {
    data.store.name = cxcec.store?.name;
  }

  if (!data.order?.entryDate) {
    data.order.entryDate = cxcec.order?.entryDate;
  }
  if (!data.order?.deliveryDate) {
    data.order.deliveryDate = cxcec.order?.deliveryDate;
  }
  if (!data.order?.client) {
    data.order.client = cxcec.order?.client;
  }
  if (!data.order?.deliveryUser) {
    data.order.deliveryUser = cxcec.order?.deliveryUser;
  }
  if (!data.order?.receivingUserLp) {
    data.order.receivingUserLp = cxcec.order?.receivingUserLp;
  }
  if (!data.order?.reEntryMerchandise) {
    data.order.reEntryMerchandise = cxcec.order?.reEntryMerchandise;
  }
  if (!data.order?.reEntryMerchandiseDate) {
    data.order.reEntryMerchandiseDate = cxcec.order?.reEntryMerchandiseDate;
  }

  if (!data.sku?.skuId) {
    data.sku.skuId = cxcec.sku?.skuId;
  }
  if (!data.sku?.description) {
    data.sku.description = cxcec.sku?.description;
  }
  if (!data.sku?.quantity) {
    data.sku.quantity = cxcec.sku?.quantity;
  }
  if (!data.sku?.lp) {
    data.sku.lp = cxcec.sku?.lp;
  }
  if (!data.sku?.status) {
    data.sku.status = cxcec.sku?.status;
  }
  if (!data.sku?.returnStatus) {
    data.sku.returnStatus = cxcec.sku?.returnStatus;
  }

  const instance = new Cxcec({
    store: data?.store,
    order: data?.order,
    sku: data?.sku,
  });
  return instance.dataValues;
};
