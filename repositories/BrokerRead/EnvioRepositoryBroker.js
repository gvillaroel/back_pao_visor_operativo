const log4js = require("log4js");
const config = require("../../log4js.json");
const { BrokerReadPool } = require("../../config/brokerReadPool");
const Schema = require("../../models/init-models");

const { Envio, Linea, OrdenVenta } = Schema.default(BrokerReadPool);
const { Op, literal } = require("sequelize");

log4js.configure(config);
const logger = log4js.getLogger("Envio Repository");

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposEnvioBroker = async () => {
  const campos = Envio.getAttributes();
  const camposSinPK = Object.keys(campos).filter((key) => campos[key].primaryKey === undefined);
  return camposSinPK;
};

/**
 * Crea un envío en BD.
 *
 * @param envio {JSON} Información de un nuevo envío
 * @return newEnvio Regresa el registro del envío en BD
 */
exports.CreateEnvioBroker = async (envio, t) => {
  try {
    const newEnvio = await Envio.create(envio, { transaction: t });
    return newEnvio;
  } catch (err) {
    logger.error(err);
    throw err
  }
};

/**
 * Verifica que exista un envío en BD buscando por número de envío.
 *
 * @param ShipmentNo {string} Número de envío para hacer la búsqueda
 * @return envio Regresa el envío de la BD
 */
exports.FetchEnviosByLineaBroker = async (OrderLineKey) => {
  const envio = await Envio.findAll({
    where: { OrderLineKey },
    order: [["FchCreacion", "DESC"]],
    attributes: { exclude: ["FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  return envio;
};

/**
 * Verifica que exista un envío en BD buscando por número de envío.
 *
 * @param ShipmentNo {string} Número de envío para hacer la búsqueda
 * @return envio Regresa el envío de la BD
 */
exports.FetchOneEnvio = async (ShipmentNo, OrderLineKey, {
   relationalRecords = false, OrderNo = null,
} = {}) => {
  const where = { ShipmentNo };
  // Obtener registros relacionados sólo si es necesario
  const include = relationalRecords ? {
    model: Linea,
    required: true,
    include: {
      required: true,
      model: OrdenVenta,
      where: OrderNo ? { OrderNo } : {},
    },
  } : [];
  if (!relationalRecords) {
    where.OrderLineKey = OrderLineKey;
  } else {
    const envios = await Envio.findAll({
      where,
      include,
      raw: true,
    });
    const envio = envios.length > 1 ? envios.find((e) => e.ShipmentNo === ShipmentNo) : envios[0];
    return envio
  }

  const envio = await Envio.findOne({
    where,
    include,
    raw: true,
  });
  return envio;
};

/**
 * Regresa todos los envíos en BD.
 *
 * @return envios Regresa un arreglo con todos los envíos en BD
 */
exports.FetchAllEnviosBroker = async () => {
  const envios = await Envio.findAll({
    raw: true,
  });
  return envios;
};

/**
 * Regresa todos los envios con estatus listo para recoger que cumplan con la cantidad
 * de días indicados en el mismo estatus.
 *
 * @param dias number es el numero de dias que debe tener el shipment en el estatus
 * listo para recoger
 * @return envios Regresa un arreglo con todos los envíos en BD
 */
exports.listosRecogerNdiasBroker = async (dias) => {
  const envios = await Envio.findAll({
    where: {
      StatusDescription: "Listo para recoger",
      FchActualizacion: {
        [Op.and]: [
          literal(`DATE("envio"."FchActualizacion") = DATE(NOW() - INTERVAL '${dias} days')`),
        ],
      },
    },
    raw: true,
  });
  return envios;
};

/**
 * Actualiza un envío en BD.
 *
 * @param envio {JSON} Información actualizada del envío
 * @return updatedEnvio Regresa el número de registros afectados
 */
exports.UpdateEnvioBroker = async (fieldsToUpdate, ShipmentNo, transaction, orderLineKey) => {
    const FchActualizacion = new Date();
    const copyFields = { ...fieldsToUpdate };
    copyFields.FchActualizacion = FchActualizacion;
    const OrderLineKey = orderLineKey || null;

    const updatedEnvio = await Envio.update(
      copyFields,
      {
        where: {
          ShipmentNo,
          OrderLineKey,
        },
      },
      { transaction },
    );
    return updatedEnvio;
};

/**
 * Elimina un envío en BD.
 *
 * @param ShipmentNo {string} Es el número de envío que se quiere eliminar
 * @return deletedEnvio Regresa el número de registros afectados
 */
exports.DeleteEnvioBroker = async (ShipmentNo) => {
  const deletedEnvio = await Envio.destroy({
    where: {
      ShipmentNo,
    },
  });
  return deletedEnvio;
};
