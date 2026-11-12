const Schema = require("../../models/init-models");
const { BrokerReadPool } = require("../../config/brokerReadPool");

const {Cliente_nuevo, Cliente, Cliente_contacto_nuevo} = Schema.default(BrokerReadPool);
const fixData = (data) => {
  const result = {};
  Object.keys(data).forEach((key) => {
    if (
        data[key] !== undefined
      && data[key] !== null
      && data[key] !== " "
      && data[key] !== "null"
      && data[key] !== "undefined"
    ) {
      result[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
    }
  });
  return result;
};

exports.FetchOneClienteNuevoBroker = async (IDCliente) => {
  IDCliente = IDCliente || null;
  let cliente = await Cliente_nuevo.findOne({
    where: { IDCliente },
    attributes: { exclude: ["IDCliente", "FchCreacion", "CURP", "RFC", "FchActualizacion"] },
    raw: true,
  });
  if (cliente === null) {
    cliente = await Cliente.findOne({
      where: { IDCliente },
      attributes: { exclude: ["IDCliente", "FchCreacion", "CURP", "RFC", "FchActualizacion"] },
      raw: true,
    });
  }
  return cliente;
};

/**
 * Verifica que exista un cliente en BD buscando por ID de cliente.
 *
 * @param IDCliente {string} ID del cliente para hacer la búsqueda
 * @return cliente Regresa el cliente de la BD
 */
exports.FetchOneClienteNuevoBroker = async (IDCliente) => {
  IDCliente = IDCliente || null;
  let cliente = await Cliente_nuevo.findOne({
    where: { IDCliente },
    attributes: { exclude: ["IDCliente", "FchCreacion", "CURP", "RFC", "FchActualizacion"] },
    raw: true,
  });
  if (cliente === null) {
    cliente = await Cliente.findOne({
      where: { IDCliente },
      attributes: { exclude: ["IDCliente", "FchCreacion", "CURP", "RFC", "FchActualizacion"] },
      raw: true,
    });
  }
  return cliente;
};

/**
 * Verifica que exista un cliente en BD buscando por ID de cliente.
 *
 * @param IDCliente {string} ID del cliente para hacer la búsqueda
 * @return cliente Regresa el cliente de la BD
 */
exports.FetchOneClienteNuevoIfExistBroker = async (IDCliente) => {
  IDCliente = IDCliente || null;
  const cliente = await Cliente_nuevo.findOne({
    where: { IDCliente },
    attributes: { exclude: ["IDCliente", "FchCreacion", "CURP", "RFC", "FchActualizacion"] },
    raw: true,
  });
  return cliente;
};

/**
 * Verifica que exista un cliente en BD buscando por ID de cliente.
 *
 * @param IDCliente {string} ID del cliente para hacer la búsqueda
 * @return cliente Regresa el cliente de la BD
 */
exports.FetchOneClienteNuevoEmailIfExistBroker = async (IDCliente) => {
  IDCliente = IDCliente || null;
  const cliente = await Cliente_nuevo.findOne({
    where: { IDCliente },
    include: [
        {
          model: Cliente_contacto_nuevo,
          attributes: ["EMailID"],
          as: "cliente_contacto_nuevos",
        },
    ],
    attributes: { },
    raw: true,
  });
  return cliente["cliente_contacto_nuevos.EMailID"];
};

/**
 * Regresa todos los clientes en BD.
 *
 * @return clientes Regresa un arreglo con todos los clientes en BD
 */
exports.FetchAllClientesNuevosBroker = async () => {
  const clientesNuevo = await Cliente_nuevo.findAll({
    raw: true,
  });
  return clientesNuevo;
};

exports.SaveClienteNuevoBroker = async (clienteNuevo, t) => {
  try {
      const [instance, created] = await Cliente_nuevo.findOrCreate({
        where: {
          IDCliente: clienteNuevo.IDCliente,
        },
        transaction: t,
        defaults: fixData(clienteNuevo),
      });
      if (!created) {
        instance.update(clienteNuevo, { transaction: t });
      }
    return clienteNuevo;
  } catch (error) {
    throw error;
  }
};
