const db = require("../config/db");
const Schema = require("../models/init-models");

const { Cxcec } = Schema.default(db);

/**
 * Obtiene los registros de Cxcec de la BD
 *
 * @param id {number} Contiene el id a buscar
 * @return fetched regresa el dato buscado
 */

/*exports.FetchCxcecByID = async (idCxcec) => {
  if (idCxcec !== null) {
    const fetched = await Cxcec.findOne({
      where: {
        id: idCxcec,
      },
      attributes: {
        exclude: ["create_time", "update_time", "fcreacion", "factualizacion"],
      },
    });
    return fetched;
  }
  return null;
};*/

exports.FetchCxcecByID = async(orderNo,skuId) =>{
  if(orderNo && skuId){
    const fetched = await Cxcec.findOne({
      where: {
        orderNo,
        skuId,
      },
      attributes: {
        exclude: ["create_time", "update_time", "fcreacion", "factualizacion"],
      },
    });
    return fetched;
  }
  return null;
};
