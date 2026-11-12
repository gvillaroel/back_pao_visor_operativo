const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { Envio } = Schema.default(db);
const { Op, literal } = require("sequelize");

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposEnvio = async () => {
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
exports.CreateEnvio = async (envio, t) => {
  try {
    const newEnvio = await Envio.create(envio, { transaction: t });
    return newEnvio;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Verifica que exista un envío en BD buscando por número de envío.
 *
 * @param ShipmentNo {string} Número de envío para hacer la búsqueda
 * @return envio Regresa el envío de la BD
 */
exports.FetchEnviosByLinea = async (OrderLineKey) => {
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
exports.FetchOneEnvio = async (ShipmentNo, OrderLineKey) => {
  const envio = await Envio.findOne({
    where: { ShipmentNo, OrderLineKey },
    raw: true,
  });
  return envio;
};

/**
 * Regresa todos los envíos en BD.
 *
 * @return envios Regresa un arreglo con todos los envíos en BD
 */
exports.FetchAllEnvios = async () => {
  const envios = await Envio.findAll({
    raw: true,
  });
  return envios;
};

/**
 * Regresa todos los envios con estatus listo para recoger que cumplan con la cantidad de días indicados en el mismo estatus.
 *
 * @param dias number es el numero de dias que debe tener el shipment en el estatus listo para recoger
 * @return envios Regresa un arreglo con todos los envíos en BD
 */
exports.listosRecogerNdias = async (dias) => {
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
exports.UpdateEnvio = async (fieldsToUpdate, ShipmentNo, t) => {
  const FchActualizacion = new Date();
  fieldsToUpdate.FchActualizacion = FchActualizacion;

  const updatedEnvio = await Envio.update(
    fieldsToUpdate,
    {
      where: {
        ShipmentNo,
      },
    },
    { transaction: t },
  );
  return updatedEnvio;
};

/**
 * Elimina un envío en BD.
 *
 * @param ShipmentNo {string} Es el número de envío que se quiere eliminar
 * @return deletedEnvio Regresa el número de registros afectados
 */
exports.DeleteEnvio = async (ShipmentNo) => {
  const deletedEnvio = await Envio.destroy({
    where: {
      ShipmentNo,
    },
  });
  return deletedEnvio;
};
