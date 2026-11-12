const db = require('../config/db');
const Schema = require('../models/init-models');
const { Sequelize } = require('sequelize');

const { Ewm } = Schema.default(db);

/**
 * Obtiene los registros de Ewm de la BD
 *
 * @param cp {string} Contiene el CP a buscar
 * @return fetched regresa la info buscada
 */
exports.FetchEwmByID = async (orderNo) => {
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

/**
 * Obtiene los registros de Ewm de la BD
 *
 * @param cp {string} Contiene el CP a buscar
 * @return fetched regresa la info buscada
 */
exports.FetchEwmBySku = async (sku) => {
  if (sku !== null) {
    const fetched = await Ewm.findOne({
      where: {
        sku:{
          [Sequelize.Op.like]: `%${sku}`
        }
      },
      attributes: { exclude: ['create_time', 'update_time'] },
      raw: true,
    });
    return fetched;
  }
  return null;
};
/**
 * Obtiene los registros de Ewm de la BD
 *
 * @param cp {string} Contiene el CP a buscar
 * @return fetched regresa la info buscada
 */
exports.FetchAllEwmBySku = async (sku) => {
  if (sku !== null) {
    const fetched = await Ewm.findAll({
      where: {
        sku:{
          [Sequelize.Op.like]: `%${sku}`
        }
      },
      attributes: { exclude: ['create_time', 'update_time'] },
      raw: true,
    });
    return fetched;
  }
  return null;
};

exports.FetchAllEwmBySkuAndOrder = async (sku,orderNo) => {
  if (sku !== null) {
    const fetched = await Ewm.findAll({
      where: {
        sku:{
          [Sequelize.Op.like]: `%${sku}`
        },
        orderNo
      },
      attributes: { exclude: ['create_time', 'update_time'] },
      raw: true,
    });
    return fetched;
  }
  return null;
};
