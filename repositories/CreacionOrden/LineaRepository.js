const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { Linea } = Schema.default(db);

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposLinea = async () => {
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
exports.CreateLinea = async (linea, t) => {
  const newLinea = await Linea.create(linea, { transaction: t });
  return newLinea;
};

/**
 * Busqueda de una linea por el OrderLineKey
 *
 * @param OrderLineKey {string} ID de la linea para busqueda
 * @return linea Regresa la línea de la BD
 */
exports.FetchLineaByOrderLineKey = async (OrderLineKey) => {
  const linea = await Linea.findAll({
    where: { OrderLineKey },
    attributes: { exclude: ["ItemID", "FchCreacion", "FchActualizacion"] },
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
exports.FetchLineaByOrden = async (OrderHeaderKey) => {
  const linea = await Linea.findAll({
    where: { OrderHeaderKey },
    attributes: { exclude: ["OrderHeaderKey", "ItemID", "FchCreacion", "FchActualizacion"] },
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
exports.FetchOneLineaByOrderAndSKU = async (OrderHeaderKey, ItemID) => {
  console.log("ItemID", ItemID);
  const linea = await Linea.findOne({
    where: { OrderHeaderKey, ItemID },
    raw: true,
  });
  return linea;
};

/**
 * Regresa todas las líneas en BD.
 *
 * @return lineas Regresa un arreglo con todas las líneas en BD
 */
exports.FetchAllLineas = async () => {
  const lineas = await Linea.findAll({
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
exports.UpdateLinea = async (fieldsToUpdate, OrderLineKey, t) => {
  fieldsToUpdate.update_time = new Date();
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
};

/**
 * Elimina una línea en BD.
 *
 * @param OrderLineKey {string} Es el ID de la línea que se quiere eliminar
 * @return deletedLinea Regresa el número de registros afectados
 */
exports.DeleteLinea = async (OrderLineKey) => {
  const deletedLinea = await Linea.destroy({
    where: {
      OrderLineKey,
    },
  });
  return deletedLinea;
};
