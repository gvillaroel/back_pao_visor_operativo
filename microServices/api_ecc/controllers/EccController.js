/* eslint-disable array-callback-return */
const log4js = require('log4js');
const asyncHandler = require('../middleware/async');
const successResponse = require("../middleware/successResponse");

const configlog4 = require('../log4js.json');
const { FetchEccIDService, FetchDataFromEcc } = require("../services/EccServices");

log4js.configure(configlog4);
const logger = log4js.getLogger('EccController');

exports.getEcc = asyncHandler(async (req, res) => {
  logger.info("En metodo Ecc");

  try {
    const { remision, sku } = req.params;
    const { refresh } = req.query;

    if (refresh && refresh === "true"){
      console.log("Se solicita refrescar Data");
      await fetchData(remision, sku, null, res);
    }else{
      console.log("Consulta normal");
      const ecc = await FetchEccIDService(remision, sku);
      if (ecc){
        successResponse(res, ecc, "Registro encontrado en data visor", 200);
      }else{
        await fetchData(remision, sku, ecc, res);
      }
    }

  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: [], error });
  }
});

async function fetchData(remision, sku, ecc, res) {
  try {
    const response = await FetchDataFromEcc(remision, ecc);
    let dataBySku;
    if (response){
      try{
        console.log("DATA De ECC", remision, sku, response );
        dataBySku = response;
      }catch{
        logger.error("Ocurrio un error al acceder a info sistema tercero");
        successResponse(res, [], `Ocurrio un error no esperado`, 500);
      }
      if (dataBySku){
        successResponse(res, dataBySku, "Registro obtenido de API Ecc terceros", 200);
      } else {
        successResponse(res, [], `No se encontró info para este SKU en la data de API de terceros Ecc`, 404);
      }
    }else{
      successResponse(res, [], `El sistema Ecc no cuenta con informacion que mostrar`, 404);
    }
  } catch (error) {
    logger.error(error);
    res.send({ code: 500, data: [], message: `Ocurrió un error consultando API de terceros 'Ecc' ${error}` });
  }
}