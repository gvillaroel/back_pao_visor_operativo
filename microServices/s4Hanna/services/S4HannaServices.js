const db = require("../config/db");
const Schema = require("../models/init-models");
const axios = require("axios");
const log4js = require("log4js");
const https = require('https');

const { S4Hanna } = Schema.default(db);
const { AreEqualJson, DeepCopy  } = require('../utils/JsonHelpers')
const { FetchS4HannaByID } = require("../repositories/S4HannaRepository");
const logger = log4js.getLogger("S4HannaController");

/**
 * LLama al repositorio para obtener el valor por ID
 * @param {*} orderNo
 * @returns
 */
exports.FetchS4HannaByIDService = async (orderNo, sku) => FetchS4HannaByID(orderNo, sku);

exports.FetchDataFromS4Hanna = async (orderNo, s4Hanna) => {
    const urlAPI = process.env.URL_S4HANNA;
    const API_KEY_S4HANNA = process.env.API_KEY_S4HANNA;
    const URL_S4HANNA_INGESTA = process.env.URL_S4HANNA_INGESTA;

    // Se salta la verificación de certificados de urls
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    const headers = {
      "apikey": API_KEY_S4HANNA,
      "store" : "suburbia"
    }
    const headersIngesta = {
      "apikey": process.env.API_KEY_INGESTA,
    }
    const response = await axios.get(
      `${urlAPI}?remision=${orderNo}`,
      {
        headers: headers,
        httpsAgent
      },
    );
    
    if (response?.data?.code == 201) {
      let isUpdate = false
      try {
        const postData = {
            isUpdate,
            data: response.data.result
        }
        const result = await axios.post(`${URL_S4HANNA_INGESTA}`, postData , {headers: headersIngesta});
        if (result.data.code !== 200) {
          logger.error("No se logró hacer la ingesta de la data");
          // Aseguramos el retorno de la data del usuario
          return response.data.result;
        }
        logger.info("Se logró hacer la ingesta de la data de s4hanna en integraciones");
        const jsonData = result.data.data.response.JSONSistema;

        return jsonData;
      } catch (error) {
        logger.error(error);
      }
      return response.data.result;
    }
    return null;
}

