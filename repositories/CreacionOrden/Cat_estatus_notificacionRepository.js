const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { CatEstatusNotificacion } = Schema.default(db);

/**
 * Crea un catálogo de estatus de notificación en BD.
 *
 * @param catEstatusNotificacion {JSON} Información de un nuevo estatus de notificación
 * @return newCatEstatusNotificacion Regresa el registro del catálogo de estatus de notificación en BD
 */
exports.CreateCatEstatusNotificacion = async (catEstatusNotificacion) => {
  const newCatEstatusNotificacion = await CatEstatusNotificacion.create(catEstatusNotificacion);
  return newCatEstatusNotificacion;
};

/**
 * Verifica que exista un catálogo de estatus de notificación en BD buscando por ID de estatus.
 *
 * @param id_estatus_notificacion {string} ID de estatus de notificación para hacer la búsqueda
 * @return catEstatusNotificacion Regresa el catálogo de estatus de notificación de la BD
 */
exports.FetchOneCatEstatusNotificacion = async (id_estatus_notificacion) => {
  const catEstatusNotificacion = await CatEstatusNotificacion.findOne({
    where: { id_estatus_notificacion: id_estatus_notificacion },
    raw: true
  });
  return catEstatusNotificacion;
};

/**
 * Regresa todos los catálogos de estatus de notificación en BD.
 *
 * @return catEstatusNotificaciones Regresa un arreglo con todos los catálogos de estatus de notificación en BD
 */
exports.FetchAllCatEstatusNotificaciones = async () => {
  const catEstatusNotificaciones = await CatEstatusNotificacion.findAll({
    raw: true
  });
  return catEstatusNotificaciones;
};

/**
 * Actualiza un catálogo de estatus de notificación en BD.
 *
 * @param catEstatusNotificacion {JSON} Información actualizada del catálogo de estatus de notificación
 * @return updatedCatEstatusNotificacion Regresa el número de registros afectados
 */
exports.UpdateCatEstatusNotificacion = async (catEstatusNotificacion) => {
  const updatedCatEstatusNotificacion = await CatEstatusNotificacion.update(
    catEstatusNotificacion,
    {
      where: {
        id_estatus_notificacion: catEstatusNotificacion.id_estatus_notificacion
      }
    }
  );
  return updatedCatEstatusNotificacion;
};

/**
 * Elimina un catálogo de estatus de notificación en BD.
 *
 * @param id_estatus_notificacion {string} Es el ID de estatus de notificación que se quiere eliminar
 * @return deletedCatEstatusNotificacion Regresa el número de registros afectados
 */
exports.DeleteCatEstatusNotificacion = async (id_estatus_notificacion) => {
  const deletedCatEstatusNotificacion = await CatEstatusNotificacion.destroy({
    where: {
      id_estatus_notificacion: id_estatus_notificacion
    }
  });
  return deletedCatEstatusNotificacion;
};
