const db = require('../config/db');
const Schema = require('../models/init-models');

const { Ewm } = Schema.default(db);
const { UpdateIntegracion } = require('../repositories/IntegracionesRepository')
const { ewmJSON, ewmJSONFull } = require('../middleware/validateJson');
const { Sequelize } = require('sequelize');

/**
 * Guarda los valores previamente tratados en el servicio
 * @param {*} body
 */
exports.CREATE_EWM = async (body, IDIntegracion) => {
  try{
      const fieldToCreate = ewmJSONFull(body);
      const response = await Ewm.create(fieldToCreate);
      await UpdateIntegracion(IDIntegracion)
      return { response, data:body }
  }catch (error){
    console.error(error)
    await UpdateIntegracion(IDIntegracion, error)
  }
};

exports.UPDATE_EWM = async (body, IDIntegracion) => {
    try{
        const fieldsToUpdateEwm = ewmJSON(body);
        const response = await Ewm.update(fieldsToUpdateEwm, {
                where: {
                    orderNo: body.order,
                },
            })
        await UpdateIntegracion(IDIntegracion)
        return { response, data:body }
    }catch (error){
        console.error(error)
        await UpdateIntegracion(IDIntegracion, error)
    }
};

exports.FIND_EWM_ORDER_IN = async (orderNo) => {
    if (orderNo !== null) {
        const fetched = await Ewm.findAll({
            where: {
                orderNo,
            },
            attributes: { exclude: ['create_time', 'update_time'] },
            raw: true,
        });
        return fetched;
    }
    return null;
};
exports.FIND_EWM_ORDER = async (orderNo) => {
    if (orderNo !== null) {
        const fetched = await Ewm.findOne({
            where: {
                orderNo,
            },
            attributes: { exclude: ['create_time', 'update_time'] },
            raw: true,
        });
        return fetched;
    }
    return null;
};

exports.FETCH_ALL_EWM_BY_SKU_AND_ORDER  = async (sku,orderNo) => {
    if (sku !== null) {
        const fetched = await Ewm.findAll({
            where: {
                sku:{
                    [Sequelize.Op.like]: `%${sku}`
                },
                orderNo
            },
            attributes: { exclude: ['fcreacion', 'factualizacion'] },
            raw: true,
        });
        return fetched;
    }
    return null;
};

