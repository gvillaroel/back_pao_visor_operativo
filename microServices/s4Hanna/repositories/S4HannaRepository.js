const db = require('../config/db');
const Schema = require('../models/init-models');

const { S4Hanna } = Schema.default(db);

/**
 * Obtiene los registros de S4Hanna de la BD
 *
 * @param cp {string} Contiene el CP a buscar
 * @return fetched regresa la info buscada
 */
exports.FetchS4HannaByID = async (orderNo, sku) => {
  if (orderNo !== null) {
    const fetched = await S4Hanna.findOne({
      where: {
        remision: orderNo,
        sku: sku,
      },
      attributes: { exclude: ['create_time', 'update_time'] },
      raw: true,
    });
    return fetched;
  }
  return null;
};
