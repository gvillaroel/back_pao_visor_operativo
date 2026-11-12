const log4js = require("log4js");
const db = require('../config/db');
const Schema = require('../models/init-models');

const { Simpliroute } = Schema.default(db);
const logger = log4js.getLogger("SimplirouteController");

const fixData = (data) => {
  let result = {};
  Object.keys(data).forEach((key) => {
      if (key !== 'id' && key !== 'created' && key !== 'modified' && data[key] !== undefined && data[key] !== null
          && data[key] !== " " && data[key] !== "null" && data[key] !== "undefined") {
            result[key] = (key === 'order' || key === 'tracking_id') ? data[key].toString() : data[key];
      }
  });
  return result;
};

/**
 * Guarda los valores previamente tratados en el servicio
 * @param {*} body
 */
exports.SaveSimpliroute = async (body) => {
  if (!Array.isArray(body)) {
    body = [body];
  } 
  try {
    const promises = body.map(async (element) => {
      const fixedData = fixData(element);
      logger.info('Creacion simpli', fixedData.reference, fixedData.tracking_id)
      const [instance, created] = await Simpliroute.findOrCreate({
          where: {
              reference: fixedData.reference,
              tracking_id: fixedData.tracking_id,
          },
          defaults: fixData(fixedData),
      });
      if (!created) {
          logger.info('Actualiza existente', fixedData.reference, fixedData.tracking_id)
          instance.update(fixedData);
      }
    });

    await Promise.all(promises);
    return 1;
  } catch (error) {
      logger.error(error);
      return error.message;
  }
};

/**
  * Verifica que exista una orden en BD buscando por OrderHeaderKey.
  *
  * @param OrdenNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneSimpliroute = async (OrderHeaderKey) => {
  const simpli = await Simpliroute.findOne({
    where: { reference: OrderHeaderKey },
    raw: true,
  });
  return simpli;
};
