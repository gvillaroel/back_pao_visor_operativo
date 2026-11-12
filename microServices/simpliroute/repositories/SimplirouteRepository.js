
const db = require('../config/db');
const Schema = require('../models/init-models');
const sequelize = require('sequelize');

const { Simpliroute } = Schema.default(db);

/**
 * Obtiene los registros de S4Hanna de la BD
 *
 * @param id {number} Contiene el id a buscar
 * @return fetched regresa el dato buscado
 */

exports.FetchSimpliroute = async (orderNo, sku) => {
  if (orderNo !== null && sku !== null) {
    const fetched = await Simpliroute.findOne({
      where: sequelize.and(
        { reference: orderNo ,
          extra_field_values: {sku:sku}
        },       
      ),
      attributes: {
        exclude: ['create_time', 'update_time', 'fcreacion', 'factualizacion'],
      }
    });
    
    return fetched;
  }
  return null;
};
