const Sequelize = require("sequelize");
const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { Cliente_contacto } = Schema.default(db.sequelize);
const { Op } = Sequelize;

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposClienteContacto = async () => {
  const campos = Cliente_contacto.getAttributes();
  const camposSinPK = Object.keys(campos).filter((key) => campos[key].primaryKey === undefined);
  return camposSinPK;
};

/**
 * Crea un contacto de cliente en BD.
 *
 * @param contacto {JSON} Información de un nuevo contacto de cliente
 * @return newContacto Regresa el registro del contacto en BD
 */
exports.CreateClienteContacto = async (contacto, t) => {
  try {
    const newContacto = await Cliente_contacto.create(contacto, { transaction: t });
    return newContacto;
  } catch (error) {
    throw error
  }
};

/**
 * Devuelve únicamente el DayPhone del cliente por ID de cliente.
 *
 * @param IDCliente {string} ID del cliente para hacer la búsqueda
 * @return dayPhone Regresa el contacto de cliente de la BD
 */
exports.FetchDayPhoneByIdCliente = async (IDCliente) => {
  IDCliente = IDCliente || null;
  const cliente = await Cliente_contacto.findOne({
    where: { IDCliente },
    attributes: ["DayPhone"],
    raw: true,
  });
  return cliente ? cliente.DayPhone : '';
};

/**
 * Obtenemos los clientes que no cuentan con telefono.
 *
 * @param N/A
 * @return contacto Regresa lista de clientes sin Day Phone
 */
exports.FetchClientesSinDayPhone = async () => {
  const contacto = await Cliente_contacto.findAll({
    where: {
      DayPhone: {
        [Op.is]: null,
      },
      FchActualizacion: {
        [Op.is]: null,
      },
    },
    order: [["FchCreacion", "DESC"]],
    limit: 900,
    raw: true,
  });
  return contacto;
};

/**
 * Verifica que exista un contacto de cliente en BD buscando por ID de contacto.
 *
 * @param IDContacto {string} ID del contacto de cliente para hacer la búsqueda
 * @return contacto Regresa el contacto de cliente de la BD
 */
exports.FetchOneClienteContactoByClientID = async (IDCliente) => {
  IDCliente = IDCliente || null;
  const contacto = await Cliente_contacto.findOne({
    where: { IDCliente },
    attributes: { exclude: ["IDContacto", "IDCliente", "FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  return contacto;
};

/**
 * Verifica que exista un contacto de cliente en BD buscando por ID de contacto.
 *
 * @param IDContacto {string} ID del contacto de cliente para hacer la búsqueda
 * @return contacto Regresa el contacto de cliente de la BD
 */
exports.FetchOneClienteContacto = async (IDContacto) => {
  IDContacto = IDContacto || null;
  const contacto = await Cliente_contacto.findOne({
    where: { IDCliente: IDContacto },
    attributes: { exclude: ["IDContacto", "IDCliente", "FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  return contacto;
};

/**
 * Verifica que exista un contacto de cliente en BD buscando por correo de contacto.
 *
 * @param email {string} el correo de cliente para hacer la búsqueda
 * @return contacto Regresa el contacto de cliente de la BD
 */
exports.FetchOneClienteContactoByCorreo = async (EMailID) => {
  EMailID = EMailID || null;
  const contacto = await Cliente_contacto.findOne({
    where: { EMailID },
    raw: true,
  });
  return contacto;
};

/**
 * Regresa todos los contactos de cliente en BD.
 *
 * @return contactos Regresa un arreglo con todos los contactos de cliente en BD
 */
exports.FetchAllClienteContactos = async () => {
  const contactos = await Cliente_contacto.findAll({
    raw: true,
  });
  return contactos;
};

/**
 * Actualiza un contacto de cliente en BD.
 *
 * @param contacto {JSON} Información actualizada del contacto de cliente
 * @return updatedContacto Regresa el número de registros afectados
 */
exports.UpdateClienteContactoNoTransact = async (fieldsToUpdate, IDCliente) => {
  try {
    fieldsToUpdate.FchActualizacion = new Date();
    const updatedContacto = await Cliente_contacto.update(
      fieldsToUpdate,
      {
        where: {
          IDCliente,
        },
      },
    );
    return updatedContacto;
  } catch (error) {
    throw error
  }
};

/**
 * Actualiza un contacto de cliente en BD.
 *
 * @param contacto {JSON} Información actualizada del contacto de cliente
 * @return updatedContacto Regresa el número de registros afectados
 */
exports.UpdateClienteContacto = async (fieldsToUpdate, IDCliente, t) => {
  try {
    const updatedContacto = await Cliente_contacto.update(
      fieldsToUpdate,
      {
        where: {
          IDCliente,
        },
      },
      { transaction: t },
    );
    return updatedContacto;
  } catch (error) {
    throw error
  }
};

/**
 * Elimina un contacto de cliente en BD.
 *
 * @param IDContacto {string} Es el ID del contacto de cliente que se quiere eliminar
 * @return deletedContacto Regresa el número de registros afectados
 */
exports.DeleteClienteContacto = async (IDContacto) => {
  const deletedContacto = await Cliente_contacto.destroy({
    where: {
      IDContacto,
    },
  });
  return deletedContacto;
};
