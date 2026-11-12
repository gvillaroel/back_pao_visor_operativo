const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { Notificacion } = Schema.default(db.sequelize);

/**
 * Crea una notificación en BD.
 *
 * @param notificacion {JSON} Información de una nueva notificación
 * @return newNotificacion Regresa el registro de la notificación en BD
 */
exports.CreateNotificacion = async (notificacion) => {
  const newNotificacion = await Notificacion.create(notificacion);
  return newNotificacion;
};

/**
 * Verifica que exista una notificación en BD buscando por ID de notificación.
 *
 * @param id_notificacion {string} ID de la notificación para hacer la búsqueda
 * @return notificacion Regresa la notificación de la BD
 */
exports.FetchOneNotificacion = async (id_notificacion) => {
  const notificacion = await Notificacion.findOne({
    where: { id_notificacion: id_notificacion },
    raw: true
  });
  return notificacion;
};

/**
 * Regresa todas las notificaciones en BD.
 *
 * @return notificaciones Regresa un arreglo con todas las notificaciones en BD
 */
exports.FetchAllNotificaciones = async () => {
  const notificaciones = await Notificacion.findAll({
    raw: true
  });
  return notificaciones;
};

/**
 * Actualiza una notificación en BD.
 *
 * @param notificacion {JSON} Información actualizada de la notificación
 * @return updatedNotificacion Regresa el número de registros afectados
 */
exports.UpdateNotificacion = async (notificacion) => {
  const updatedNotificacion = await Notificacion.update(
    notificacion,
    {
      where: {
        id_notificacion: notificacion.id_notificacion
      }
    }
  );
  return updatedNotificacion;
};

/**
 * Elimina una notificación en BD.
 *
 * @param id_notificacion {string} Es el ID de notificación que se quiere eliminar
 * @return deletedNotificacion Regresa el número de registros afectados
 */
exports.DeleteNotificacion = async (id_notificacion) => {
  const deletedNotificacion = await Notificacion.destroy({
    where: {
      id_notificacion: id_notificacion
    }
  });
  return deletedNotificacion;
};
