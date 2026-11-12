const db = require("../config/db");
const Schema = require("../models/init-models");

const { Cxcec } = Schema.default(db);
/**
 * Guarda los valores previamente tratados en el servicio
 * @param {*} body
 */
exports.SaveCxcec = async (cxcec) => {
  const { order, sku } = cxcec;
  const newCxcec = {
    ...cxcec,
    orderNo: order.orderId,
    skuId: sku.skuId,
  };
  const save = await Cxcec.create(newCxcec);
  return save;
};

exports.FetchCxcecByID = async(orderNo, skuId) =>{
  if (orderNo) {
    const fetched = await Cxcec.findOne({
      where: {
        orderNo,
        skuId,
      },
      attributes: {
        exclude: ["create_time", "update_time", "fcreacion", "factualizacion"],
      },
    });
    return fetched;
  }
  return null;
};

exports.updateCxcec = async (cxcec, orderNo, skuId) => {
  const save = await Cxcec.update({
      store: cxcec.store,
      order: cxcec.order,
      sku: cxcec.sku,
      orderNo: cxcec.orderNo,
      skuId: cxcec.skuId,
    }, {
        where: {
          orderNo,
          skuId,
        },
        attributes: {
          exclude: ["create_time", "update_time", "fcreacion", "factualizacion"],
        },
    });
  return save;
};
