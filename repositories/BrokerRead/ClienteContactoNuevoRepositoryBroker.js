const Sequelize = require("sequelize");
const Schema = require("../../models/init-models");
const { BrokerReadPool } = require("../../config/brokerReadPool");

const { Cliente_contacto_nuevo, Cliente_contacto } = Schema.default(BrokerReadPool);
const { Op } = Sequelize;

const fixData = (data) => {
  let result = {};
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

exports.FetchOneClienteContactoNuevoBroker = async (IDCliente) => {
  IDCliente = IDCliente || null;
  let contacto = await Cliente_contacto_nuevo.findOne({
    where: { IDCliente: IDCliente },
    attributes: { exclude: ["IDContacto", "IDCliente", "FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  if (contacto===null){
     contacto = await Cliente_contacto.findOne({
        where: { IDCliente: IDCliente },
        attributes: { exclude: ["IDContacto", "IDCliente", "FchCreacion", "FchActualizacion"] },
        raw: true,
    });
  }
  return contacto;
};


/**
 * Obtenemos los clientes que no cuentan con telefono.
 *
 * @param N/A
 * @return contacto Regresa lista de clientes sin Day Phone
 */
exports.FetchClientesSinDayPhoneBroker = async () => {
  const contacto = await Cliente_contacto_nuevo.findAll({
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
 * Regresa todos los contactos de cliente en BD.
 *
 * @return contactos Regresa un arreglo con todos los contactos de cliente en BD
 */
exports.FetchAllClienteContactosBroker = async () => {
  const contactos = await Cliente_contacto_nuevo.findAll({
    raw: true,
  });
  return contactos;
};

exports.SaveClienteContactoNBroker = async (clienteContactoN, t) => {
  try {    
    
      const [instance, created] = await Cliente_contacto_nuevo.findOrCreate({
        where: {
          IDCliente:clienteContactoN.IDCliente
        },
        transaction: t,
        defaults: fixData(clienteContactoN),
      },      
    );
      if (!created) {                
        await Cliente_contacto_nuevo.update(
          fixData(clienteContactoN),
          {
            where: {
              IDCliente :instance.IDCliente,
              IDContacto : instance.IDContacto,
            },
          },
          { transaction: t },
        );     
      }            
    return clienteContactoN;
  } catch (error) {
    throw error;
  }
};

