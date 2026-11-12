const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { Cliente } = Schema.default(db);

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposCliente = async () => {
  const campos = Cliente.getAttributes();
  const camposSinPK = Object.keys(campos).filter((key) => campos[key].primaryKey === undefined);
  return camposSinPK;
};

/**
 * Crea un cliente en BD.
 *
 * @param cliente {JSON} Información de un nuevo cliente
 * @return newCliente Regresa el registro del cliente en BD
 */
exports.CreateCliente = async (cliente, t) => {
  const newCliente = await Cliente.create(cliente, { transaction: t });
  return newCliente;
};

/**
 * Verifica que exista un cliente en BD buscando por ID de cliente.
 *
 * @param IDCliente {string} ID del cliente para hacer la búsqueda
 * @return cliente Regresa el cliente de la BD
 */
exports.FetchOneCliente = async (IDCliente) => {
  IDCliente = IDCliente || null;
  const cliente = await Cliente.findOne({
    where: { IDCliente },
    attributes: { exclude: ["IDCliente", "FchCreacion", "CURP", "RFC", "FchActualizacion"] },
    raw: true,
  });
  return cliente;
};

/**
 * Regresa todos los clientes en BD.
 *
 * @return clientes Regresa un arreglo con todos los clientes en BD
 */
exports.FetchAllClientes = async () => {
  const clientes = await Cliente.findAll({
    raw: true,
  });
  return clientes;
};

/**
 * Actualiza un cliente en BD.
 *
 * @param cliente {JSON} Información actualizada del cliente
 * @return updatedCliente Regresa el número de registros afectados
 */
exports.UpdateCliente = async (fieldsToUpdate, IDCliente, t) => {
  const updatedCliente = await Cliente.update(
    fieldsToUpdate,
    {
      where: {
        IDCliente,
      },
    },
    { transaction: t },
  );
  return updatedCliente;
};

/**
 * Elimina un cliente en BD.
 *
 * @param IDCliente {string} Es el ID del cliente que se quiere eliminar
 * @return deletedCliente Regresa el número de registros afectados
 */
exports.DeleteCliente = async (IDCliente) => {
  const deletedCliente = await Cliente.destroy({
    where: {
      IDCliente,
    },
  });
  return deletedCliente;
};
