const axios = require("axios");
const { Op } = require("sequelize");
const https = require("https");
const db = require("../config/db");
const log4js = require('log4js');
const Schema = require("../models/init-models");


const configlog4 = require('../log4js.json');
log4js.configure(configlog4);
const logger = log4js.getLogger('XdRepository');

const { Xd } = Schema.default(db);
const { DeepCopy, AreObjectsEqual } = require("../utils/JsonHelpers");

/* eslint-disable func-style */
/**
 * Obtiene los registros de Xd de la BD
 *
 * @param id {number} Contiene el id a buscar
 * @return fetched regresa el dato buscado
 */
exports.FetchXdByID = async ({ remission, sku }) => {
    if (remission !== null || sku !== null) {
        // transaction = await Xd.sequelize.transaction()
        const fetched = await Xd.findOne({
            where: {
                [Op.and]: [
                    { num_remision: remission },
                    { SKU_cve : sku }
                ]
            },
            attributes: {
                exclude: ['create_time', 'update_time', 'fcreacion', 'factualizacion'],
            },
        });
        if(fetched) return fetched;
        const response = await FetchByID(remission, sku);
        return response
    }
    return null;
};
/* eslint-enable func-style */
const FetchByID = async (remission, sku) => {
  // Se salta la verificación de certificados de urls
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });
  const headers = {
    "apikey": process.env.APIKEY_SATELITE,
  }
  const returnData = await axios.get(
    `${process.env.URL_XD_SATELITE}?remission=${remission}&sku=${sku}`,
    {
        headers: headers,
        httpsAgent,
    },
  ).then(res=>{
        return res;
      })
    .catch(error=>{
        return error;
    })
    if (returnData && returnData.data && returnData.data.code == 200) {
        await SaveXD(returnData.data.data?.result);
        return returnData.data.data?.result;
    } else {
        logger.error("Error al obtener la información en sistema de terceros de XD");
        logger.error(returnData.message);
        return null;
    }
}

const SaveXD = async (data) => {
    const postData = {
        result: data,
    }
    return await axios.post(process.env.XD_POST, postData ,
        {
            headers: {
                'apikey': process.env.APIKEY_CONSULTA_XD,
                'store': 'liverpool',
                'Content-Type': 'Application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'X-Requested-With'
            }
        })
        .then( res  => {
            return 1
        })
        .catch(error => {
            return error
        })
}

