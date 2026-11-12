const db = require('../config/db');
const Schema = require('../models/init-models');
const axios = require('axios');
const log4js = require('log4js');
const configLog4 = require('../log4js.json');
const https = require('https');

const { Siebel } = Schema.default(db);

/**
 * Obtiene los registros de S4Hanna de la BD
 *
 * @param id {number} Contiene el id a buscar
 * @return fetched regresa el dato buscado
 */

log4js.configure(configLog4);
const logger = log4js.getLogger('SiebelController');

exports.FetchSiebelByStrOrdenVenta = async (
  strOrdenVenta = null,
  strEmailContacto = null,
  strTelContacto = null
) => {
  const buildConditional = (
    strOrdenVenta,
    strEmailContacto,
    strTelContacto
  ) => {
    const buildObject = {};

    if (strEmailContacto) {
      buildObject.strEmailContacto = strEmailContacto;
    }
    if (strTelContacto) {
      buildObject.strTelContacto = strTelContacto;
    }
    if (strOrdenVenta) {
      buildObject.strOrdenVenta = strOrdenVenta;
    }
    return buildObject;
  };
  if (strOrdenVenta !== null) {
    const fetched = await Siebel.findOne({
      where: buildConditional(strOrdenVenta, strEmailContacto, strTelContacto),
      attributes: {
        exclude: ['create_time', 'update_time', 'fcreacion', 'factualizacion'],
      },
    });
    return fetched;
  }
  return null;
};

exports.FetchExternalSiebelByStrOrdenVenta = async (strOrdenVenta) => {
  logger.info('En metodo getSiebel consulta externa');
  const urlAPI = process.env.URL_EXTERNAL_SIEBEL;
  const siebelGet = process.env.API_KEY_SIEBEL_GET;
  const siebelPost = process.env.API_KEY_SIEBEL_POST;
  const siebelUrlPost = process.env.URL_SIEBEL_INGESTA;
  // Se salta la verificación de certificados de urls
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const headers = {
    apikey: siebelGet,
  };

  try {
    const externalResponse = await axios.get(
      `${urlAPI}?OrderNumber=${strOrdenVenta}`,
      {
        headers,
        httpsAgent,
      }
    );

    const newData =
      externalResponse.data.result.LVPQuerySR_Output.ListOfLvpsratg
        .LvpServiceRequestAtg;

    if (externalResponse?.data?.code === 200) {
      try {
        await axios.post(`${siebelUrlPost}`, newData[0], {
          headers,
        });
      } catch (error) {
        logger.error(error);
      }
    }
    return newData;
  } catch (error) {
    if (error.response && error.response.status === 500) {
      // Aquí va el código que maneja el error 500
      console.error(
        'Error 500: El servidor encontró un error interno.',
        error.response.data
      );
      return error;
    } else {
      // Manejo de otros errores
      console.error('Error al realizar la petición:', error);
      return error;
    }
  }
};
