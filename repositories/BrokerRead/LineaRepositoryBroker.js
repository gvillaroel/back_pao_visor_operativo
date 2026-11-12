const log4js = require("log4js");
const config = require("../../log4js.json");
const { BrokerReadPool } = require("../../config/brokerReadPool");
const Schema = require("../../models/init-models");
const { esCadenaFechaValida } = require("../../utils/utils");

const { Linea } = Schema.default(BrokerReadPool);

log4js.configure(config);
const logger = log4js.getLogger("Line Repository");

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposLineaBroker = async () => {
  const campos = Linea.getAttributes();
  const camposSinPK = Object.keys(campos).filter((key) => campos[key].primaryKey === undefined);
  return camposSinPK;
};

/**
 * Crea una línea en BD.
 *
 * @param linea {JSON} Información de una nueva línea
 * @return newLinea Regresa el registro de la línea en BD
 */
exports.CreateLineaBroker = async (linea, t) => {
  try {
    const newLinea = await Linea.create(linea, { transaction: t });
    return newLinea;
  } catch (error) {
    throw error
  }
};

/**
 * Busqueda de una linea por el OrderLineKey
 *
 * @param OrderLineKey {string} ID de la linea para busqueda
 * @return linea Regresa la línea de la BD
 */
exports.FetchLineaByOrderLineKeyBroker = async (OrderLineKey) => {
  const linea = await Linea.findAll({
    where: { OrderLineKey },
    attributes: { exclude: ["ItemID", "FchCreacion", "FchActualizacion"] },
    order: [
      ["PrimeLineNo", "ASC"], // Orden ascendente para PrimeLineNo
    ],
    raw: true,
  });
  return linea;
};

/**
 * Verifica que exista una línea en BD buscando por ID de línea.
 *
 * @param OrderLineKey {string} ID de la línea para hacer la búsqueda
 * @return linea Regresa la línea de la BD
 */
exports.FetchLineaByOrdenBroker = async (OrderHeaderKey) => {
  const linea = await Linea.findAll({
    where: { OrderHeaderKey },
    attributes: { exclude: ["OrderHeaderKey", "FchCreacion", "FchActualizacion"] },
    order: [
      ["PrimeLineNo", "ASC"], // Orden ascendente para PrimeLineNo
    ],
    raw: true,
  });
  return linea;
};

/**
 * Verifica que exista una línea en BD buscando por ID de línea.
 *
 * @param OrderLineKey {string} ID de la línea para hacer la búsqueda
 * @return linea Regresa la línea de la BD
 */
exports.FetchOneLineaByOrderAndSKUBroker = async (OrderHeaderKey, ItemID, PrimeLineNo) => {
  logger.info("OrderHeaderKey", OrderHeaderKey, "ItemID", ItemID);
  const linea = await Linea.findOne({
    where: { OrderHeaderKey, ItemID, PrimeLineNo },
    order: [
      ["PrimeLineNo", "ASC"], // Orden ascendente para PrimeLineNo
    ],
    raw: true,
  });
  return linea;
};

/**
 * Verifica que exista una línea en BD buscando por ID de línea.
 *
 * @param OrderLineKey {string} ID de la línea para hacer la búsqueda
 * @return linea Regresa la línea de la BD
 */
exports.FetchOneLineaByOrderAndSKUAndPrimeLineNoBroker = async (
  OrderHeaderKey,
  ItemID,
  PrimeLineNo) => {
  logger.info("OrderHeaderKey", OrderHeaderKey, "ItemID", ItemID, "PrimeLineNo", PrimeLineNo);
  const linea = await Linea.findOne({
    where: { OrderHeaderKey, ItemID, PrimeLineNo },
    order: [
      ["PrimeLineNo", "ASC"], // Orden ascendente para PrimeLineNo
    ],
    raw: true,
  });
  return linea;
};

/**
 * Verifica que exista una línea en BD buscando por ID de línea.
 *
 * @param OrderLineKey {string} ID de la línea para hacer la búsqueda
 * @return linea Regresa la línea de la BD
 */
exports.FetchOneLineaByOrderLineAndSKUBroker = async (OrderHeaderKey, OrderLineKey, ItemID) => {
  logger.info("OrderHeaderKey", OrderHeaderKey, "ItemID", ItemID);
  const linea = await Linea.findOne({
    where: { OrderHeaderKey, OrderLineKey, ItemID },
    order: [
      ["PrimeLineNo", "ASC"], // Orden ascendente para PrimeLineNo
    ],
    raw: true,
  });
  return linea;
};

/**
 * Regresa todas las líneas en BD.
 *
 * @return lineas Regresa un arreglo con todas las líneas en BD
 */
exports.FetchAllLineasBroker = async () => {
  const lineas = await Linea.findAll({
    order: [
      ["PrimeLineNo", "ASC"], // Orden ascendente para PrimeLineNo
    ],
    raw: true,
  });
  return lineas;
};

/**
 * Actualiza una línea en BD.
 *
 * @param linea {JSON} Información actualizada de la línea
 * @return updatedLinea Regresa el número de registros afectados
 */
exports.UpdateLineaBroker = async (fieldsToUpdate, OrderLineKey, t) => {
  try {
    if (fieldsToUpdate.ReqDeliveryDate !== undefined) {
      logger.info("en metodo UpdateLinea: ", fieldsToUpdate.ReqDeliveryDate, await esCadenaFechaValida(fieldsToUpdate.ReqDeliveryDate));
      fieldsToUpdate.ReqDeliveryDate = await esCadenaFechaValida(fieldsToUpdate.ReqDeliveryDate)
        ? fieldsToUpdate.ReqDeliveryDate : null;
    }
    if (fieldsToUpdate.ReqDeliveryDate1 !== undefined) {
      logger.info("en metodo UpdateLinea: ", fieldsToUpdate.ReqDeliveryDate1, await esCadenaFechaValida(fieldsToUpdate.ReqDeliveryDate1));
      fieldsToUpdate.ReqDeliveryDate1 = await esCadenaFechaValida(fieldsToUpdate.ReqDeliveryDate1)
        ? fieldsToUpdate.ReqDeliveryDate1 : null;
    }
    fieldsToUpdate.FchActualizacion = new Date();
    const updatedLinea = await Linea.update(
      fieldsToUpdate,
      {
        where: {
          OrderLineKey,
        },
      },
      { transaction: t },
    );
    return updatedLinea;
  } catch (error) {
    throw error
  }
};

/**
 * Actualiza DerivedPrimeLineNo de una línea en BD.
 *
 * @param {string} OrderHeaderKey - Clave del encabezado de la orden
 * @param {number} PrimeLineNo - Número de línea principal
 * @return {number} Regresa el número del registro afectado
 */
exports.UpdateDerivedPrimeLineaBroker = async (OrderHeaderKey, PrimeLineNo) => {
  try {
    const fieldsToUpdate = {
      DerivedPrimeLineNo: PrimeLineNo,
      FchActualizacion: new Date(),
    };
    
    const [updatedLinea] = await Linea.update(
      fieldsToUpdate,
      {
        where: {
          OrderHeaderKey: OrderHeaderKey,
          PrimeLineNo: PrimeLineNo,
        },
      }
    );

    return updatedLinea;
  } catch (error) {
    throw error;
  }
};

/**
 * Elimina una línea en BD.
 *
 * @param OrderLineKey {string} Es el ID de la línea que se quiere eliminar
 * @return deletedLinea Regresa el número de registros afectados
 */
exports.DeleteLineaBroker = async (OrderLineKey) => {
  const deletedLinea = await Linea.destroy({
    where: {
      OrderLineKey,
    },
  });
  return deletedLinea;
};

exports.ActualizaLineKeysBroker = async (BuscarLinea, Lineas) => {
  logger.info("BuscarLinea", BuscarLinea, "Lineas", Lineas)
  for (const orderLine of Lineas) {
    const { OrderLineKey, PrimeLineNo } = orderLine;
    const ItemID = orderLine.Item.ItemID
    await Linea.update(
      {
        OrderLineKey: OrderLineKey,
      },
      {
        where: {
          OrderHeaderKey: BuscarLinea,
          PrimeLineNo,
          ItemID,
        },
      },
    );
  }
};

exports.UpdateLineHoldByKeysBroker = async (OrderLineKey, PrimeLineNo) => {      
    await Linea.update(
      {
        ExtnPauseForRDDADD: 'Y'
      },
      {
        where: {
          OrderLineKey,
          PrimeLineNo
        },
      },
    );  
};

/**
 * Consultar linea y validar si es resurtido
 * @param {*} OrderLineKey ID de la linea
 * @returns boolean true si es resurtido
 */
exports.ValidateReshipParentLineKeyBroker = async (OrderLineKey) => {
  if (!OrderLineKey) {
    logger.warn("No se puede validar si es resurtido por falta de OrderLineKey");
    return false;
  }

  const responseLine = await this.FetchLineaByOrderLineKeyBroker(OrderLineKey);
  if (Array.isArray(responseLine) && responseLine.length) {
    return responseLine.every(({ PrimeLineNo }) => PrimeLineNo !== 1);
  }
  return false;
};
