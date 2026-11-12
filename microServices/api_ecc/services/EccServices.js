const db = require("../config/db");
const Schema = require("../models/init-models");
const axios = require("axios");
const log4js = require("log4js");
const https = require('https');

const { Ecc } = Schema.default(db);
const { FetchEccByID } = require("../repositories/EccRepository");
const logger = log4js.getLogger("S4HannaController");

/**
 * LLama al repositorio para obtener el valor por ID
 * @param {*} orderNo
 * @returns
 */
exports.FetchEccIDService = async (remision, sku) => FetchEccByID(remision, sku);

exports.FetchDataFromEcc = async (remision, sku) => {
    const urlAPI = process.env.URL_ECC_SATELITE;
    const API_KEY_ECC = process.env.APIKEY_CONSULTA_ECC;
    const URL_ECC_INGESTA = process.env.ECC_POST;

    // Se salta la verificación de certificados de urls
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    const headers = {
      'Content-Type': 'Application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With'
    }
    const headersIngesta = {
      "apikey": API_KEY_ECC,
      'store': 'liverpool',
      'Content-Type': 'Application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With'
    }
    const response = await axios.post(
      `${urlAPI}?remision=${orderNo}`,{},
      {
        headers: headers,
        httpsAgent
      },
    );
    if (response?.data?.code == 201) {
      let isUpdate = false
      const fetched = await Ecc.findOne({
        where: {
          remision,
          sku
        },
        attributes: { exclude: ['create_time', 'update_time'] },
        raw: true,
      });
      if (fetched) {
        const payload = returnData.data.data
        const alreadyExist = DeepCopy(payload)
        if (alreadyExist.remision === fetched.remision) {
          const objComparable = DeepCopy(fetched)
          if (objComparable.hasOwnProperty('id')) {
            delete objComparable.id
          }
          if (AreEqualJson(alreadyExist, objComparable)) {
            return { fetched, directResponse: true }
          }
          isUpdate = true
        }
      }
      try {
        const postData = {
            isUpdate,
            data: response.data.data
        }
        const result = await axios.post(`${URL_ECC_INGESTA}`, postData , {headers: headersIngesta});
        if (result.data.code !== 200) {
          logger.error("No se logró hacer la ingesta de la data");
          // Aseguramos el retorno de la data del usuario
          return response.data;
        }
        logger.info("Se logró hacer la ingesta de la data de Ecc en integraciones");
        const jsonData = result.data.data.response.JSONSistema;

        return jsonData;
      } catch (error) {
        logger.error(error);
      }
      return response.data;
    }
    return null;
}
