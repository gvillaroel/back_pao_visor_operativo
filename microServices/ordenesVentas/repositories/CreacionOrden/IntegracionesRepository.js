const log4js = require("log4js");
const Sequelize = require("sequelize");
const config = require("../../log4js.json");
const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { Op, literal } = Sequelize;
const { Integraciones } = Schema.default(db.sequelize);
const visibles = 100;

log4js.configure(config);
const logger = log4js.getLogger("Integraciones");

/**
 * Crea una integración en BD.
 *
 * @param integracion {JSON} Información de una nueva integración
 * @return newIntegracion Regresa el registro de la integración en BD
 */
exports.CreateIntegracion = async (integracion) => {
  const newIntegracion = await Integraciones.create(integracion);
  return newIntegracion;
};

/**
 * Obtener numero de intentos de entrega
 *
 * @param Numero de OrderHeaderKey
 * @return Se obtiene el numero de intentos de entrega
 */
exports.FetchCountIntentosEntrega = async (orderHeaderKey, orderLineKey, shipmentNo) => {
  logger.info("en metodo FetchCountIntentosEntrega", orderHeaderKey, orderLineKey);
  const total = await Integraciones.count({
    where: {
      MessageType: "UNCONFIRM_SHIPMENT",
      OrderHeaderKey: orderHeaderKey,
      [Op.and]: Sequelize.literal("\"JSONSistema\"::text LIKE :orderLineKey"),
      [Op.and]: Sequelize.literal("\"JSONSistema\"::text LIKE :shipmentNo"),
    },
    replacements: {
      orderLineKey: `%${orderLineKey}%`,
      shipmentNo: `%${shipmentNo}%`,
    },
    raw: true,
  });
  return total ?? 0;
};

/**
 * Verifica que exista una integración en BD buscando por ID de integración.
 *
 * @param IDIntegracion {string} ID de la integración para hacer la búsqueda
 * @return integracion Regresa la integración de la BD
 */
exports.FetchOneIntegracion = async (IDIntegracion) => {
  const integracion = await Integraciones.findOne({
    where: { IDIntegracion },
    raw: true,
  });
  return integracion;
};

/**
 * Regresa todas las integraciones de una orden que se encuentren en estado de pendientes.
 *
 * @param No corresponde al numero de orden
 * @return integraciones Regresa integraciones pendientes
 */
exports.FetchAllIntegracionesPendientes = async (No, sistema, idRow) => {
  const integraciones = await Integraciones.findAll({
    where: {
      OrderHeaderKey: No, Sistema: sistema, EstatusEjecucion: false, IDIntegracion: idRow,
    },
    order: [["FchCreacion", "ASC"]],
    raw: true,
  });
  return integraciones;
};

/**
 * Regresa todas las integraciones de una orden.
 *
 * @param No corresponde al numero de orden
 * @return integraciones Regresa integraciones pendientes
 */
exports.FetchAllIntegraciones = async (No, sistema) => {
  const integraciones = await Integraciones.findAll({
    where: { OrderHeaderKey: No, Sistema: sistema },
    order: [["FchCreacion", "ASC"]],
    raw: true,
  });
  return integraciones;
};

/**
 * Regresa todas las integraciones.
 *
 * @param OrderNo corresponde al numero de orden
 * @return integraciones Regresa integraciones
 */
exports.FetchHistoricoIntegraciones = async (OrderNo) => {
  logger.info("en metodo FetchHistoricoIntegraciones", "orden", OrderNo);
  const integraciones = await Integraciones.findAll({
    where: {
      [Op.and]: Sequelize.literal(`"JSONSistema"::text LIKE :OrderNo`),
    },
    replacements: {
      OrderNo: `%${OrderNo}%`,
    },
    order: [["FchCreacion", "DESC"]],
    limit: 100,
    raw: true,
  });
  return integraciones;
};

/**
 * Regresa los errores que han ocurrido, un arreglo de errores unicos
 *
 * @return integraciones Regresa errores pendientes
 */
exports.FetchErroresUnique = async () => {
  let erroresUnicos = await Integraciones.findAll({
    where: {
      EstatusEjecucion: false,
      Sistema: {
        [Op.in]: ["INT300", "INT201", "GESTOR"],
      },
    },
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("error")), "error"],
      [Sequelize.fn("COUNT", Sequelize.col("error")), "count"],
    ],
    group: ["error"],
  });

  erroresUnicos = erroresUnicos.filter((item) => {
    if (item.error !== null) {
      return item;
    }
  });

  return erroresUnicos;
};

/**
 * Regresa un conteo de los registros que tuvieron intentos de entrega
 *
 * @return integraciones Regresa numero de intentos por OrderHeaderKey
 */
exports.FetchErroresUniqueReprocesar = async () => {
  const erroresUnicos = await Integraciones.findAll({
    where: {
      EstatusEjecucion: false,
      Sistema: {
        [Op.in]: ["INT300", "INT201", "GESTOR"],
      },
      error: 'SequelizeUniqueConstraintError: Validation error'
    },
    order: [["FchCreacion", "ASC"]],
    limit: 200,
    raw: true,
  });

  return erroresUnicos;
};

/**
 * Regresa un conteo de los registros que tuvieron intentos de entrega
 *
 * @return integraciones Regresa numero de intentos por OrderHeaderKey
 */
exports.FetchErroresUniqueReprocesarAPIGEEInt2010 = async () => {
  const erroresUnicos = await Integraciones.findAll({
    where: {
      //EstatusEjecucion: true,
      Sistema: {
        [Op.in]: ["INTAPIGEE2010"],
      },
      //IDIntegracion: '178569'
      [Op.or]: [
        { error: { [Op.notLike]: '%Direccion Actualizada%' } },
        { error: null }
      ]
    },
    order: [["FchCreacion", "ASC"]],
    limit: 200,
    raw: true,
  });

  return erroresUnicos;
};

/**
 * Regresa integraciones que contienen un error y que no se han ejecutado
 *
 * @param error corresponde tipo de error
 * @return integraciones Regresa integraciones pendientes
 */
exports.FetchOrdenesWithError = async (error, page) => {
  const offset = ((page === undefined ? 0 : page - 1) * visibles);
  const integracionesPaginacion = await Integraciones.findAll({
    attributes: [
      [Sequelize.literal("DISTINCT ON (\"OrderHeaderKey\") \"IDIntegracion\""), "IDIntegracion"],
      "OrderHeaderKey",
      "FchCreacion",
      "JSONSistema",
      "Sistema",
    ],
    where: {
      error,
      EstatusEjecucion: false,
      OrderHeaderKey: { [Op.not]: null },
    },
    order: [["OrderHeaderKey", "ASC"], ["FchCreacion", "ASC"]],
    limit: visibles,
    offset: offset < 0 || offset === undefined ? 0 : offset,
    raw: true,
  });

  const integracionesTotal = await Integraciones.count({
    where: {
      error,
      EstatusEjecucion: false,
      OrderHeaderKey: { [Op.not]: null },
    },
    attributes: { exclude: ["FchCreacion", "FchActualizacion"] },
    order: [["OrderHeaderKey", "ASC"], ["FchCreacion", "ASC"]],
    limit: visibles,
    offset: offset < 0 || offset === undefined ? 0 : offset,
    raw: true,
  });

  return { registros: integracionesPaginacion, total: integracionesTotal };
};

/**
 * Regresa integraciones que contienen un error y que no se han ejecutado
 *
 * @param error corresponde tipo de error
 * @return integraciones Regresa integraciones pendientes
 */
exports.FetchOrdenesWithErrorOrderHeaderKey = async (error, page) => {
  const offset = ((page === undefined ? 0 : page - 1) * visibles);
  // Consulta utilizando Sequelize.literal para DISTINCT ON
  const integracionesPaginacion = await Integraciones.findAll({
    attributes: [
      [Sequelize.literal("DISTINCT ON (\"JSONSistema\"->'Order'->>'OrderNo') \"IDIntegracion\""), "IDIntegracion"],
      "OrderHeaderKey",
      "FchCreacion",
      "JSONSistema",
      "Sistema",
    ],
    where: {
      error,
      EstatusEjecucion: false,
    },
    order: [[Sequelize.literal("\"JSONSistema\"->'Order'->>'OrderNo'"), "ASC"], ["FchCreacion", "ASC"]],
    limit: visibles,
    offset: offset < 0 || offset === undefined ? 0 : offset,
    raw: true,
  });

  const integracionesTotal = await Integraciones.count({
    where: {
      error,
      EstatusEjecucion: false,
    },
    attributes: { exclude: ["FchCreacion", "FchActualizacion"] },
    order: [["OrderHeaderKey", "ASC"], ["FchCreacion", "ASC"]],
    limit: visibles,
    offset: offset < 0 || offset === undefined ? 0 : offset,
    raw: true,
  });

  return { registros: integracionesPaginacion, total: integracionesTotal };
};

/**
 * Actualiza una integración en BD.
 *
 * @param integracion {JSON} Información actualizada de la integración
 * @return updatedIntegracion Regresa el número de registros afectados
 */
exports.UpdateIntegracionNoTransact = async (fieldsToUpdate, IDIntegracion) => {
  try {
    fieldsToUpdate.update_time = new Date();
    fieldsToUpdate.FchActualizacion = new Date();

    // Si `t` no está presente, ejecuta la actualización sin transacción
    const updatedIntegracion = await Integraciones.update(
      fieldsToUpdate,
      {
        where: {
          IDIntegracion,
        },
      },
    );
    return updatedIntegracion;
  } catch (error) {
    throw error
  }
};

/**
 * Actualiza una integración en BD.
 *
 * @param integracion {JSON} Información actualizada de la integración
 * @return updatedIntegracion Regresa el número de registros afectados
 */
exports.UpdateIntegracion = async (fieldsToUpdate, IDIntegracion, t) => {
  try {
    fieldsToUpdate.update_time = new Date();
    fieldsToUpdate.FchActualizacion = new Date();

    if (t) {
      // Si `t` está presente, ejecuta la transacción
      const updatedIntegracion = await Integraciones.update(
        fieldsToUpdate,
        {
          where: {
            IDIntegracion,
          },
        },
        { transaction: t },
      );
      return updatedIntegracion;
    }
    // Si `t` no está presente, ejecuta la actualización sin transacción
    const updatedIntegracion = await Integraciones.update(
      fieldsToUpdate,
      {
        where: {
          IDIntegracion,
        },
      },
    );
    return updatedIntegracion;
  } catch (error) {
    throw error
  }
};

/**
 * Elimina una integración en BD.
 *
 * @param IDIntegracion {string} Es el ID de la integración que se quiere eliminar
 * @return deletedIntegracion Regresa el número de registros afectados
 */
exports.DeleteIntegracion = async (IDIntegracion) => {
  const deletedIntegracion = await Integraciones.destroy({
    where: {
      IDIntegracion,
    },
  });
  return deletedIntegracion;
};

exports.FetchLatestOrdersByDate = async (orderHeaderKey, lowerBound, limit, daysBefore) => {
  const fixedLowerBound = new Date(lowerBound);
  fixedLowerBound.setDate(fixedLowerBound.getDate() - daysBefore);
  const upperBound = new Date();
  upperBound.setDate(upperBound.getDate() + 4);

  const formattedLowerBound = fixedLowerBound.toISOString().slice(0, 10);
  const formattedUpperBound = upperBound.toISOString().slice(0, 10);

  return Integraciones.findAll({
    where: {
      error: null,
      EstatusEjecucion: true,
      [Op.and]: [
        { OrderHeaderKey: orderHeaderKey },
        { Sistema: "INT201" },
        { FchCreacion: { [Op.between]: [formattedLowerBound, formattedUpperBound] } },
      ],
    },
    order: [["FchCreacion", "DESC"]],
    limit,
  });
};

/**
 * Actualiza una integración en BD si es de apigee.
 * OrderHeaderKey de apigee por el de la 201 en base a orderNo
 * @param OrderHeaderKey number
 * @param OrderNo number
 * @return None
 */
exports.UpdateIntegracionApigee = async (OrderHeaderKey, OrderNo) => {
  await Integraciones.update(
    {
      OrderHeaderKey,
    },
    {
      where: {
        OrderHeaderKey: OrderNo,
        Sistema: 'INTAPIGEE2010',
      },
    },
  );
};

/**
 * Verifica que exista una integración en BD buscando por número de orden.
 * y que el estatus de ejecucion sea false
 * @param OrderNo {string} ID de la integración para hacer la búsqueda
 * @return integracion Regresa la ultima integración de la BD que cumpla con los criterios
 */
exports.FetchOneIntegracion = async (OrderNo) => {
  const integracion = await Integraciones.findOne({
    limit: 1,
    where: {
      OrderNo,
      EstatusEjecucion: false,
    },
    order: [['FchCreacion', 'DESC']],
  });
  return integracion;
};
