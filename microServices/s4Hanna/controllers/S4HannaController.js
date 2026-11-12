
/* eslint-disable array-callback-return */
const https = require("node:https");
const log4js = require("log4js");
const successResponse = require("../middleware/successResponse");
const asyncHandler = require("../middleware/async");
const { Mutex } = require('async-mutex');

const configlog4 = require("../log4js.json");
const { FetchS4HannaByIDService, FetchDataFromS4Hanna } = require("../services/S4HannaServices");

log4js.configure(configlog4);
const logger = log4js.getLogger("S4HannaController");

const mutex = new Mutex();

function LimpiaLetras(datos){
  let datoSinLetras = datos.replace(/[a-zA-Z]/g, '');
  return datoSinLetras
}

exports.getS4Hanna = asyncHandler(async (req, res) => {
  logger.info("En metodo getS4Hanna");

  try {
    const { orderNo, sku } = req.params;
    const { refresh } = req.query;

    if (refresh && refresh === "true"){
      if (mutex.isLocked()) {
        successResponse(res, s4Hanna, "Ya hay una consulta a terceros en proceso", 429);
      } else {
        const release = await mutex.acquire();
        try {
          await fetchData(orderNo, sku, null, res);
        } finally {
          release();
        }
      }
    }else{
      const s4Hanna = await FetchS4HannaByIDService(orderNo, sku);
      if (s4Hanna){
        successResponse(res, s4Hanna, "Registro encontrado en data visor", 200);
      }else{
        if (mutex.isLocked()) {
          successResponse(res, s4Hanna, "Ya hay una consulta a terceros en proceso", 429);
        } else {
          const release = await mutex.acquire();
          try {
            await fetchData(orderNo, sku, s4Hanna, res);
          } finally {
            release();
          }
        }
      }
    }

  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: [], error });
  }
});

async function fetchData(orderNo, sku, s4Hanna, res) {
  try {
    const response = await FetchDataFromS4Hanna(orderNo, s4Hanna);
    let dataBySku;
    if (response){
      try{
        dataBySku = response.find(x => LimpiaLetras(x.sku) === sku);
      }catch{
        logger.error("Ocurrio un error al acceder a info sistema tercero");
        successResponse(res, [], `Ocurrio un error no esperado`, 500);
      }
      if (dataBySku){
        successResponse(res, dataBySku, "Registro obtenido de API s4hanna terceros", 200);
      } else {
        successResponse(res, [], `No se encontró info para este SKU en la data de API de terceros S4Hanna`, 404);
      }
    }else{
      successResponse(res, [], `El sistema S4Hanna no cuenta con informacion que mostrar`, 404);
    }
  } catch (error) {
    logger.error(error);
    res.send({ code: 500, data: [], message: `Ocurrió un error consultando API de terceros 's4Hanna' ${error}` });
  }
}
