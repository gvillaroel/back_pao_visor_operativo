const log4js = require("log4js");
const config = require("../../log4js.json");
const db = require("../../config/db");
const Schema = require("../../models/init-models");

log4js.configure(config);
const logger = log4js.getLogger("Cliente Dirección");

const { Cliente_direccion_nuevo, Cliente_direccion} = Schema.default(db.sequelize);

const fixData = (data) => {
  let result = {};
  Object.keys(data).forEach((key) => {
    if (key === "AddressLine2" || key === "AddressLine3"){
      //Se ha solicitado que estos 2 campos se actualiza aun si  estan vacios
      result[key] = typeof data[key] === "string" ? data[key].trim() : data[key];  
    }else{
      if (
          data[key] !== undefined
        && data[key] !== null
        && data[key] !== " "
        && data[key] !== "null"
        && data[key] !== "undefined"
      ) 
      {
        result[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      }
    }  
  });
  return result;
};

exports.FetchOneClienteDireccionNuevo = async (IDCliente) => {
  let direccion = await Cliente_direccion_nuevo.findOne({
    where: { IDCliente: IDCliente },
    attributes: { exclude: ["FchCreacion", "IDCliente", "IDClienteDireccion", "HttpUrl", "UseCount", "Suffix", "VerificationStatus", "FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  if (direccion===null){
    direccion = await Cliente_direccion.findOne({
        where: { IDCliente: IDCliente },
        attributes: { exclude: ["FchCreacion", "IDCliente", "IDClienteDireccion", "HttpUrl", "UseCount", "Suffix", "VerificationStatus", "FchCreacion", "FchActualizacion"] },
        raw: true,
    });
  }
  return direccion;
};


/**
 * Regresa todas las direcciones de cliente en BD.
 *
 * @return direcciones Regresa un arreglo con todas las direcciones de cliente en BD
 */
exports.FetchAllClienteDirecciones = async () => {
  const direcciones = await Cliente_direccion_nuevo.findAll({
    raw: true,
  });
  return direcciones;
};

exports.SaveClienteDireccionN = async (clienteDireccionN, t) => {
  try {    
      const [instance, created] = await Cliente_direccion_nuevo.findOrCreate({
        where: {
          IDCliente:clienteDireccionN.IDCliente
        },
        transaction: t,
        defaults: fixData(clienteDireccionN),
      },     
    );
    if (!created) {        
        //instance.update(fixData(clienteDireccionN),{ transaction: t });
        await Cliente_direccion_nuevo.update(
          fixData(clienteDireccionN),
          {
            where: {
              IDCliente :instance.IDCliente,
              IDClienteDireccion : instance.IDClienteDireccion,
            },
          },
          { transaction: t },
        );        
    } 
    return clienteDireccionN;
  } catch (error) {    
    throw error;
  }
};
