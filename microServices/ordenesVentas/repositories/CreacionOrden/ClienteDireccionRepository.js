const log4js = require("log4js");
const config = require("../../log4js.json");
const db = require("../../config/db");
const Schema = require("../../models/init-models");

log4js.configure(config);
const logger = log4js.getLogger("Cliente Dirección");

const { Cliente_direccion } = Schema.default(db.sequelize);

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposClienteDireccion = async () => {
  const campos = Cliente_direccion.getAttributes();
  const camposSinPK = Object.keys(campos).filter((key) => campos[key].primaryKey === undefined);
  return camposSinPK;
};

/**
 * Crea una dirección de cliente en BD.
 *
 * @param direccion {JSON} Información de una nueva dirección de cliente
 * @return newDireccion Regresa el registro de la dirección en BD
 */
exports.CreateClienteDireccionNoTransact = async (direccion) => {
  try {
    const newDireccion = await Cliente_direccion.create(direccion);
    return newDireccion;
  } catch (error) {
    throw error;
  }
};

/**
 * Crea una dirección de cliente en BD.
 *
 * @param direccion {JSON} Información de una nueva dirección de cliente
 * @return newDireccion Regresa el registro de la dirección en BD
 */
exports.CreateClienteDireccion = async (direccion, t) => {
  try {
    const newDireccion = await Cliente_direccion.create(direccion, { transaction: t });
    return newDireccion;
  } catch (error) {
    throw error;
  }
};

/**
 * Verifica que exista una dirección de cliente en BD buscando por ID de cliente_direccion.
 *
 * @param FchCreacion {string} ID de la dirección de cliente para hacer la búsqueda
 * @return direccion Regresa la dirección de cliente de la BD
 */
exports.FetchOneClienteDireccionByClientID = async (IDCliente) => {
  IDCliente = IDCliente || null;
  const direccion = await Cliente_direccion.findOne({
    where: { IDCliente },
    attributes: { exclude: ["FchCreacion", "IDCliente", "FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  return direccion;
};

/**
 * Verifica que exista una dirección de cliente en BD buscando por ID de cliente_direccion.
 *
 * @param FchCreacion {string} ID de la dirección de cliente para hacer la búsqueda
 * @return direccion Regresa la dirección de cliente de la BD
 */
exports.FetchOneClienteDireccionByClientIDForCreation = async (IDCliente) => {
  IDCliente = IDCliente || null;
  const direccion = await Cliente_direccion.findOne({
    where: { IDCliente },
    raw: true,
  });
  return direccion;
};

/**
 * Verifica que exista una dirección de cliente en BD buscando por ID de cliente_direccion.
 *
 * @param FchCreacion {string} ID de la dirección de cliente para hacer la búsqueda
 * @return direccion Regresa la dirección de cliente de la BD
 */
exports.FetchOneClienteDireccion = async (IDContacto) => {
  const direccion = await Cliente_direccion.findOne({
    where: { IDCliente: IDContacto },
    attributes: { exclude: ["FchCreacion", "IDCliente", "IDClienteDireccion", "HttpUrl", "UseCount", "Suffix", "VerificationStatus", "FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  return direccion;
};

/**
 * Regresa todas las direcciones de cliente en BD.
 *
 * @return direcciones Regresa un arreglo con todas las direcciones de cliente en BD
 */
exports.FetchAllClienteDirecciones = async () => {
  const direcciones = await Cliente_direccion.findAll({
    raw: true,
  });
  return direcciones;
};

/**
 * Actualiza una dirección de cliente en BD.
 *
 * @param direccion {JSON} Información actualizada de la dirección de cliente
 * @return updatedDireccion Regresa el número de registros afectados
 */
exports.UpdateClienteDireccionNoTransact = async (fieldsToUpdate, IDCliente) => {
  try {
    const updatedDireccion = await Cliente_direccion.update(
      fieldsToUpdate,
      {
        where: {
          IDCliente,
        },
      },
    );
    return updatedDireccion;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualiza una dirección de cliente en BD.
 *
 * @param direccion {JSON} Información actualizada de la dirección de cliente
 * @return updatedDireccion Regresa el número de registros afectados
 */
exports.UpdateClienteDireccion = async (fieldsToUpdate, IDCliente, t) => {
  try {
    const updatedDireccion = await Cliente_direccion.update(
      fieldsToUpdate,
      {
        where: {
          IDCliente,
        },
      },
      { transaction: t },
    );
    return updatedDireccion;
  } catch (error) {
    throw error;
  }
};

/**
 * Elimina una dirección de cliente en BD.
 *
 * @param FchCreacion {string} Es el ID de la dirección de cliente que se quiere eliminar
 * @return deletedDireccion Regresa el número de registros afectados
 */
exports.DeleteClienteDireccion = async (FchCreacion) => {
  const deletedDireccion = await Cliente_direccion.destroy({
    where: {
      FchCreacion,
    },
  });
  return deletedDireccion;
};
