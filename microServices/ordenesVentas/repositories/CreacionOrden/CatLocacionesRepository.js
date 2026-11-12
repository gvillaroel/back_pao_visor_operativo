const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { Cat_locaciones } = Schema.default(db.sequelize);

/**
 * Llenado de locaciones primera carga
 *
 * @param bulk {ARRAY} Contiene los registros a ingresar
 * @return newBulk regresa registros insertados
 */
exports.BulkLocaciones = async (bulk) => {
  await Cat_locaciones.destroy({ where: {}, truncate: true })
  const newBulk = await Cat_locaciones.bulkCreate(bulk);
  return newBulk;
};

/**
 * Inserta una nueva locacion
 *
 * @param locacion {JSON} Contiene el body de la nueva locacion
 * @return newLocacion regresa el registro insertado
 */
exports.createLocacion = async (locacion) => {
  if (locacion !== null) {
    const newLocacion = await Cat_locaciones.create(locacion);
    return newLocacion;
  } else {
    return null
  }
};

/**
 * Llenado de locaciones primera carga
 *
 * @param id {int} Contiene el id a buscar
 * @return newBulk regresa registros insertados
 */
exports.FetchLocacionByID = async (id) => {
  if (id !== null) {
    id = parseInt(id)
    const fetched = await Cat_locaciones.findOne({
      where:
        { LocacionVentaNum: id },
      attributes: { exclude: ['FchCreacion', 'FchActualizacion'] }
    });
    return fetched;
  } else {
    return null
  }
};

/**
 * Recupera todos los registros de locaciones
 *
 * @return fetchedLocaciones regresa registros recuperados
 */
exports.FetchLocaciones = async () => {
  const fetchedLocaciones = await Cat_locaciones.findAll({
    attributes: { exclude: ['FchCreacion', 'FchActualizacion'] }
  });
  return fetchedLocaciones;
};

/**
 * Actualiza un registro en particular
 *
 * @param id {int} Contiene el id a buscar
 * @param locacion {JSON} Contiene el body con los cambios
 * @return updated regresa cuantos registros fueron afectados
 */
exports.updateLocacion = async (id, locacion) => {
  if (id !== null) {
    id = parseInt(id)
    locacion.FchActualizacion = new Date()
    const updated = await Cat_locaciones.update(
      locacion,
      {
        where:
          { LocacionVentaNum: id }
      });
    return updated;
  } else {
    return null
  }
};

/**
 * Elimina un registro
 *
 * @param id {int} Contiene el id a buscar
 * @return deleted regresa el registro eliminado
 */
exports.deleteLocacion = async (id) => {
  if (id !== null) {
    id = parseInt(id)
    const deleted = await Cat_locaciones.destroy({
      where:
        { LocacionVentaNum: id }
    });
    return deleted;
  } else {
    return null
  }
};