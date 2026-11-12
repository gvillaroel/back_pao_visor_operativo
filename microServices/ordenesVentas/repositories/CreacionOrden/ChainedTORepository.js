/* eslint-disable max-len */
const log4js = require("log4js");
const config = require("../../log4js.json");
const { sequelize } = require("../../config/db");
const Schema = require("../../models/init-models");

const { TOOrder } = Schema.default(sequelize);

const { Op, literal } = require("sequelize");

log4js.configure(config);
const logger = log4js.getLogger("ChainedTORepository");

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposChained = async () => {
  const campos = TOOrder.getAttributes();
  const camposSinPK = Object.keys(campos).filter((key) => campos[key].primaryKey === undefined);
  return camposSinPK;
};

/**
 * Crea un ChainedTO en BD.
 *
 * @param ChainedTO {JSON} Información de un nuevo ChainedTO
 * @return newEnvio Regresa el registro del ChainedTO en BD
 */
exports.CreateChainedTO = async (chainedTO, t) => {
  try {
    const newchainedTO = await TOOrder.create(chainedTO, { transaction: t });
    return newchainedTO;
  } catch (err) {
    logger.error(err);
    throw err
  }
};

/**
 * Verifica que exista un ChainedTO en BD buscando por número de ChainedTO.
 *
 * @param ShipmentNo {string} Número de ChainedTO para hacer la búsqueda
 * @return envio Regresa el ChainedTO de la BD
 */
exports.FetchChainedTOByLinea = async (OrderLineKey, OrderHeaderKey) => {
  const chainedTO = await TOOrder.findAll({
    where: { OrderLineKey, OrderHeaderKey },
    order: [["FchCreacion", "DESC"]],
    attributes: { exclude: ["FchCreacion", "FchActualizacion", "ID_TOOrder"] },
    distinct: true,
    raw: true,
  });
  return chainedTO;
};

/**
 * Verifica que exista un ChainedTO en BD buscando por número de OLK, OHK, ItemID y OrderNo.
 *
 * @param ShipmentNo {string} Número de ChainedTO para hacer la búsqueda
 * @return envio Regresa el ChainedTO de la BD
 */
exports.FetchChainedTOByLineaItemOrderNo = async (OrderLineKey, OrderHeaderKey, ItemID, OrderNo) => {
  const chainedTO = await TOOrder.findAll({
    where: {
      OrderLineKey, 
      OrderHeaderKey,
      ItemID,
      OrderNo
    },
    order: [["FchCreacion", "DESC"]],
    attributes: { exclude: ["FchCreacion", "FchActualizacion", "ItemID", "ID_TOOrder"] },
    distinct: true,
    raw: true,
  });
  return chainedTO;
};

/**
 * Regresa todos los ChainedTO en BD.
 *
 * @return envios Regresa un arreglo con todos los ChainedTO en BD
 */
exports.FetchAllChainedTO = async () => {
  const envios = await TOOrder.findAll({
    raw: true,
  });
  return envios;
};

/**
 * Actualiza un ChainedTO en BD.
 *
 * @param envio {JSON} Información actualizada del ChainedTO
 * @return updatedChainedTO Regresa el número de registros afectados
 */
exports.UpdateChainedTO = async (fieldsToUpdate, OrderLineKey, OrderHeaderKey, ItemID, OrderNo, t) => {
  try {
    const FchActualizacion = new Date();
    fieldsToUpdate.FchActualizacion = FchActualizacion;

    const updatedChainedTO = await TOOrder.update(
      fieldsToUpdate,
      {
        where: {
          OrderLineKey,
          OrderHeaderKey,
          ItemID,
          OrderNo
        },
      },
      { transaction: t },
    );
    return updatedChainedTO;
  } catch (error) {
    throw error
  }
};

/**
 * Elimina un ChainedTO en BD.
 *
 * @param OrderLineKey {string} Es el número de ChainedTO que se quiere eliminar
 * @return deletedChainedTO Regresa el número de registros afectados
 */
exports.DeleteChainedTO = async (OrderLineKey) => {
  const deletedChainedTO = await TOOrder.destroy({
    where: {
      OrderLineKey,
    },
  });
  return deletedChainedTO;
};
