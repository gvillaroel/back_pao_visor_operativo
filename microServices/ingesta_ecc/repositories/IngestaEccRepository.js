const db = require('../config/db');
const Schema = require('../models/init-models');

const { Ecc } = Schema.default(db);
const { UpdateIntegracion } = require('../repositories/IntegracionesRepository')
/**
 * Obtiene los registros de ECC de la BD
 *
 * @param id {number} Contiene el id a buscar
 * @return fetched regresa el dato buscado
 */

/**
 * Guarda los valores previamente tratados en el servicio
 * @param {*} body
 */
exports.SaveEcc = async (body) => {
  try{
    const data = fixData(body.data);
    const response =  body.isUpdate ? 
        await Ecc.update(data, {
          where: {
            remision: body.data.remision,
          },
        })
        : await Ecc.create(data);
    return  response
  }catch (error){
    console.error(error)
  }
};

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
      result[key] = data[key].trim();
    }
  });
  return result;
};