const db = require('../config/db');
const Schema = require('../models/init-models');
const axios = require('axios');
const https = require('https');

const { ReceivedGift, Mdr, PPurchase, EvAdress, EvGuest, EvOwners } =
  Schema.default(db);

/**
 * Obtiene los registros de Mdr de la BD
 *
 */
exports.FetchMdrById = async (event) => {
  //Esto se realiza porque en Mdr el evento No tiene el primer caracter
  const xevent = event.substring(1,event.length );
  if (event !== null) {
    const fetched = await Mdr.findOne({
      include: [
        {
          model: PPurchase,
          as: 'personalPurchases',
          attributes: {
            exclude: ['fcreacion', 'factualizacion', 'mdr_eventId', 'id'],
          },
        },
        {
          model: ReceivedGift,
          as: 'receivedGifts',
          attributes: {
            exclude: [
              'fcreacion',
              'factualizacion',
              'create_time',
              'update_time',
              'mdr_eventId',
              'id',
            ],
          },
        },
        {
          model: EvAdress,
          as: 'eventAddresses',
          attributes: {
            exclude: ['fcreacion', 'factualizacion', 'mdr_eventId', 'id'],
          },
        },
        {
          model: EvOwners,
          as: 'eventOwners',
          attributes: { exclude: ['id', 'mdr_eventId'] },
        },
        {
          model: EvGuest,
          as: 'eventGuests',
          attributes: {
            exclude: ['fcreacion', 'factualizacion', 'id', 'mdr_eventId'],
          },
        },
      ],
      where: {
        eventId: xevent,
      },
    });

    if(fetched) return fetched;
    console.log(' No existe datos en local se consulta Servicio externo :' )
    const response = await FetchByID(event);    
    if(!response || response.data == null) return null;
    const returnData = response.data.data.response.eventSummary;      
    return returnData;
  }
  return null;
};


const FetchByID = async (event) =>{  
  try{
    const headers = {
      apikey: process.env.API_KEY_EXTERNA,
    };
    // Se salta la verificación de certificados de urls
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    const xevent = event.substring(1,event.length );
    const URL = process.env.URL_MDR_SATELITE + '?event=' + xevent;

    console.log(" URL EXTERNO:  " + URL)
    //console.log(" APIKEY EXTERNO:  " + process.env.API_KEY_EXTERNA)
    
    const returnData = await axios.get(`${URL}`,{ headers, httpsAgent })
        .then(res=>{
            console.log('then', res)
            return res
        })
        .catch(error=>{
            console.log('catch::', error)
            throw error
        })
    if  (returnData.data.result?.status?.status=='success'   ){
        return await SaveMdr(returnData.data)
    }else{
        console.error('Existio un error al consultar Servicio Externo MDR :', returnData.data.result?.status?.errorMessage);      
        throw new Error('Existio un error al consultar Servicio Externo MDR :' +returnData.data.result?.status?.errorMessage)
    }
  }catch (error) {
    console.error('Error al Leer servicio externo :', error);    
    throw error;  
  }  
}

const SaveMdr = async (data) =>{
  console.log(" URL INGESTA:  " + process.env.MDR_POST)
  return await axios.post(process.env.MDR_POST, data ,
      {
        headers: {
          'apikey': process.env.APIKEY_CONSULTA_MDR,
          'store': 'liverpool',
          'Content-Type': 'Application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'X-Requested-With'
        }
      })
      .then(res => {
        return res
      })
      .catch(error => {
        throw error
      })  
}