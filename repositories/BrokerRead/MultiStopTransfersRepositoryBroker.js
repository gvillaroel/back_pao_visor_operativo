const log4js = require("log4js");
const config = require("../../log4js.json");
const { BrokerReadPool } = require("../../config/brokerReadPool");
const Schema = require("../../models/init-models");

const { MultiStopTransfers } = Schema.default(BrokerReadPool);

log4js.configure(config);
const logger = log4js.getLogger("Multi Stop Transfers");

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposMultiStopTransfersBroker = async () => {
  const campos = MultiStopTransfers.getAttributes();
  const camposSinPK = Object.keys(campos).filter((key) => campos[key].primaryKey === undefined);
  return camposSinPK;
};

/**
 * Crea un nuevo registro en BD.
 *
 * @param MultiStopTransfers {JSON} Información de un nuevo registro
 * @return newRow Regresa el registro de agregado en BD
 */
exports.CreateRowBroker = async (objeto, t) => {
  try {
    const newRow = await MultiStopTransfers.create(objeto, { transaction: t });
    return newRow;
  } catch (error) {
    throw error
  }
};

/**
 * Verifica que exista un registro en BD buscando por OrderHeaderKey.
 *
 * @param OrderHeaderKey {string} identificador de la orden a la que pertenece el registro
 * @return Regresa el registro de la BD
 */
exports.FetchMultiStopTransfersByOrdenBroker = async (OrderHeaderKey, OrderNo) => {
  logger.info("En metodo FetchMultiStopTransfersByOrden, OrderHeaderKey", OrderHeaderKey, ", OrderNo", OrderNo)
  const row = await MultiStopTransfers.findAll({
    where: { OrderHeaderKey, OrderNo: "'" + OrderNo + "'" },
    attributes: { exclude: ["FchCreacion", "FchActualizacion"] },
    order: [
      ["IdMultiSopts", "DESC"], // Orden ascendente por fecha de creación
    ],
    raw: true,
  });
  return row;
};

/**
 * Verifica que exista un registro en BD buscando por OrderHeaderKey.
 *
 * @param OrderHeaderKey {string} identificador de la orden a la que pertenece el registro
 * @return Regresa el registro de la BD
 */
exports.FetchMultiStopTransfersByOrdenAndShipNoBroker = async (OrderHeaderKey, OrderNo, ShipmentNo) => {
  logger.info("En metodo FetchMultiStopTransfersByOrden, OrderHeaderKey", OrderHeaderKey, ", OrderNo", OrderNo)
  const row = await MultiStopTransfers.findAll({
    where: { OrderHeaderKey, OrderNo: "'" + OrderNo + "'", ShipmentNo },
    attributes: { exclude: ["FchCreacion", "FchActualizacion"] },
    order: [
      ["IdMultiSopts", "DESC"], // Orden ascendente por fecha de creación
    ],
    raw: true,
  });
  return row;
};

/**
 * Regresa todas los registros en BD.
 *
 * @return Regresa un arreglo con todas los registros en BD
 */
exports.FetchAllMultiStopTransfersBroker = async () => {
  const rows = await MultiStopTransfers.findAll({
    order: [
      ["PrimeLineNo", "ASC"], // Orden ascendente para PrimeLineNo
    ],
    raw: true,
  });
  return rows;
};

/**
 * Actualiza un registro en BD.
 *
 * @param {JSON} Información actualizada del registro
 * @return UpdateMultiStopTransfers Regresa el número de registros afectados
 */
exports.UpdateRowBroker = async (fieldsToUpdate, IdMultiSopts, t) => {
  try {
    fieldsToUpdate.FchActualizacion = new Date();
    const updatedRow = await MultiStopTransfers.update(
      fieldsToUpdate,
      {
        where: {
          IdMultiSopts,
        },
      },
      { transaction: t },
    );
    return updatedRow;
  } catch (error) {
    throw error
  }
};

/**
 * Elimina un registro en BD.
 *
 * @param IdMultiSopts {string} Es el ID del registro que se quiere eliminar
 * @return deletedLinea Regresa el número de registros afectados
 */
exports.DeleteRowBroker = async (IdMultiSopts) => {
  const deletedRow = await MultiStopTransfers.destroy({
    where: {
      IdMultiSopts,
    },
  });
  return deletedRow;
};
