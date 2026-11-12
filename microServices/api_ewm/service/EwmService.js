const { FetchEwmByID,
  FetchAllEwmBySkuAndOrder
} = require('../repositories/EwmRepository');
const { getExternoService,
  getExternoServiceV2
} = require('./ExternoService');
const log4js = require('log4js');
const logger = log4js.getLogger('ExternoService');

exports.getEwmService = async (req, res) => {
  try {
    console.log('En get Ewm service');
    const orderNo = req.query.orderNo;
    const location = req.query.location;
    console.log(' orderNo   ' + orderNo);
    console.log(' location   ' + location);

    const xEwm = await FetchEwmByID(orderNo);
    try {
      const data= await getExternoService(orderNo, location, xEwm);
      /* const payloadPersist = {
        integracion: data.res.response.IDIntegracion,
        data: data.res.response.JSONSistema,
        isUpdate: data.isUpdate
      }
     await SaveEwmTable(payloadPersist) */
      return data;
    } catch (error) {
      logger.error(error);
      throw error;
      /*
      res.send({
        code: 200,
        data: [],
        message: `Ocurrió un error consultando API de terceros 'EWM' ${error}`,
      });
      */
    }
  } catch (error) {
    console.error('Error al leer Ewm:::', error);
    throw error;
  }
};

exports.getEwmServiceV2 = async (req, res) => {
  try {
    console.log('En get Ewm service');
    const orderNo = req.body.orderNo;
    const sku = req.body.sku;
    const nodes = req.body.nodos
    try {
      for(const node of nodes){
        const xEwm = await FetchAllEwmBySkuAndOrder(sku, orderNo);
        await getExternoServiceV2(orderNo, node, xEwm);
      }
      const response = await FetchAllEwmBySkuAndOrder(sku, orderNo)
      return BuildResponse(response, nodes)
    } catch (error) {
      logger.error(error);
      throw error;      
    }
  } catch (error) {
    console.error('Error al leer Ewm:::', error);
    throw error;
  }
};

const BuildResponse = (data, nodes) => {
  const sortedData = data.sort((a, b) => parseInt(b.id_ewm) - parseInt(a.id_ewm))
  const responseObject = [...new Set(sortedData.map(x=> x.level))]
  const responseData = {}
  for(const object of responseObject){
    responseData[object] = []
  }
  for(const node of nodes){
    const nodeData = sortedData.filter(x=> x.level === node.nodo && x.lgNum === node.location)
    for(const element of nodeData){
     responseData[node.nodo].push(SolveElementType(element))
    }
  }
  return responseData
}

const SolveElementType = element => {
  if(element.odoDocNo){
    return {odo: element}
  }else if (element.idoDocNo){
    return {ido: element}
  }else{
    return {paquito: element}
  }
}
