const Sequelize = require("sequelize");
const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { Op } = Sequelize;
const { Integraciones } = Schema.default(db);
const visibles = 100;

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
exports.FetchAllIntegracionesPendientes = async (No, sistema) => {
  const integraciones = await Integraciones.findAll({
    where: { OrderHeaderKey: No, Sistema: sistema, EstatusEjecucion: false },
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
  const integraciones = await Integraciones.findAll({
    where: Sequelize.json("JSONSistema.Order.OrderNo", OrderNo),
    order: [["FchCreacion", "DESC"]],
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
    where: { EstatusEjecucion: false },
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
 * Regresa los errores que han ocurrido, un arreglo de errores unicos
 *
 * @return integraciones Regresa errores pendientes
 */
exports.FetchErroresUniqueReprocesar = async () => {
  const erroresUnicos = await Integraciones.findAll({

    where: {
      EstatusEjecucion: false,
      IDIntegracion: '2650388',
    },
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
exports.UpdateIntegracion = async (fieldsToUpdate, IDIntegracion, t) => {
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
