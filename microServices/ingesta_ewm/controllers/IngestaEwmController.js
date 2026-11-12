/* eslint-disable array-callback-return */
const log4js = require('log4js');
const asyncHandler = require('../middleware/async');

const configlog4 = require('../log4js.json');
// const { SaveIngestaEwmService } = require('../services/IngestaEwmService');
const { CreateIntegracion } = require('../repositories/IntegracionesRepository')
// const clientResponse = require('../middleware/clientResponse');
log4js.configure(configlog4);
const logger = log4js.getLogger('IngestaEwmController');
const successResponse = require('../middleware/successResponse');
const { CREATE_OR_UPDATE_EWM } = require('../services/IngestaEwmService');


exports.saveIngestaEwm = asyncHandler(async (req, res) => {
  logger.info('Save ingesta ewm');
  try {    
    evaluaData(req)
    const isUpdate = req.body.isUpdate
    const integracion = {
      Sistema: 'EWM',
      JSONSistema: req.body.data,
      MessageType: isUpdate ? 'Update Satelite Ewm' : 'Create Satelite Ewm',
      OrderHeaderKey: req.body.data[0].order
    };
    const newIntegracion = await CreateIntegracion(integracion)
    if (newIntegracion !== null) {
      const response = await CREATE_OR_UPDATE_EWM(req.body, newIntegracion)
      successResponse(res, { response }, 'Successful operation');
    }else {
      successResponse(res, {}, 'Integration Cannot Be Null');
    }

  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {},error: error.toString() });
  }
});

function evaluaData(req){
  try{  
    if (Object.keys(req.body.data[0]).length ===0){
      throw new Error('Datos en la tabla integracion estan vacios');
    }      
  }catch(ex){
    throw new Error( 'Datos en integracion estan vacios');
  }  
}

