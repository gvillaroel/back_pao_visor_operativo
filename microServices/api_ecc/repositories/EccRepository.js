const db = require('../config/db');
const Schema = require('../models/init-models');
const { Ecc } = Schema.default(db);

/**
 * Obtiene los registros de Ecc de la BD
 *
 * @param cp {string} Contiene el CP a buscar
 * @return fetched regresa la info buscada
 */

exports.FetchEccByID = async (remision, sku) => {
  if (remision !== null) {
    const fetched = await Ecc.findOne({
      where: {
        remision: remision,
        sku: sku,
      },
      attributes: { exclude: ['create_time', 'update_time'] },
      raw: true,
    });
    return fetched;
  }
  return null;
};