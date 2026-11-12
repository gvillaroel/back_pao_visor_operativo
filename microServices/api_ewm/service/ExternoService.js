const axios = require('axios');
const { logger } = require('sequelize/lib/utils/logger');
const log4js = require('log4js');
const https = require('https');
const logger1 = log4js.getLogger('IngestaEwmController');

const {
  DeepCopy,
  AreEqualJson
} = require('../utils/JsonHelpers');
const { FetchAllEwmBySku,
  FetchAllEwmBySkuAndOrder
} = require('../repositories/EwmRepository');

exports.getExternoService = async (orderNo, location, xEwm) => {
  const URL =
    process.env.URL_API_EXTERNA + '?order=' + orderNo + '&location=' + '0098';
  // const URL='http://localhost:4022/oms/api/ecc/1'

  // Se salta la verificación de certificados de urls
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const headers = {
    apikey: process.env.API_KEY_EXTERNA,
  };

  const headersIngesta = {
    apikey: process.env.API_KEY_INGESTA,
  };

  const response = await axios.get(`${URL}`, { headers, httpsAgent });

  if (response?.data?.code === 200) {
    const isUpdate = false
    try {
      const payload = {
        data : response.data.result,
        isUpdate
      }
      return  await axios.post(`${process.env.URL_API_INGESTA}`, payload, {
        headers: headersIngesta,
      })
      .then(res=>{
         return {res: payload}
      })
      .catch(error=>{
        logger1.error(error);
      })
    } catch (error) {
      console.log(error);
    }
  }
};

exports.getExternoServiceV2 = async (orderNo, node, xEwm) => {
  const URL =
      process.env.URL_API_EXTERNA + '?order=' + orderNo + '&location=' + node.location;
  
  // Se salta la verificación de certificados de urls
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const headers = {
    apikey: process.env.API_KEY_EXTERNA,
  };

  const headersIngesta = {
    apikey: process.env.API_KEY_INGESTA,
  };

  const response = await axios.get(`${URL}`, { headers, httpsAgent });

  if (response?.data?.code === 200 && response?.data?.result) {
    const isUpdate = false
    try {
      const payload = {
        data : response.data.result,
        isUpdate,
        node
      }
      /* In case of the payload is empty, nothing change, so just return the found data, otherwise make the request with the non duplicate payload */
      if(payload.data.length <= 0) return xEwm
      payload.xEwm = xEwm
      return  await axios.post(`${process.env.URL_API_INGESTA}`, payload, {
        headers: headersIngesta,
      })
          .then(res=>{
            return {res: payload}
          })
          .catch(error=>{
            logger1.error(error);
          })
    } catch (error) {
      console.log(error);
    }
  }
};
