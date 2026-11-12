/* eslint-disable array-callback-return */
const log4js = require('log4js');
const asyncHandler = require('../middleware/async');

const configlog4 = require('../log4js.json');
const { getEwmService,
  getEwmServiceV2
} = require('../service/EwmService');

log4js.configure(configlog4);
const logger = log4js.getLogger('EwmController');

exports.getEwm = asyncHandler(async (req, res) => {
  logger.info('En metodo getEwm');

  try {
    const ewm = await getEwmService(req, res);
    if (ewm !== null) {
      res.send({ code: 200, data: ewm, message: 'success' });
    } else {
      res.send({ code: 200, data: {}, message: 'success' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: [], error });
  }
});

exports.getEwmV2 = asyncHandler(async (req,res)=>{
  logger.info('Metodo V2 EWM');

  try {
    const ewm = await getEwmServiceV2(req, res);
    if (ewm !== null) {
      res.send({ code: 200, data: ewm, message: 'success' });
    } else {
      res.send({ code: 200, data: {}, message: 'success' });
    }    
  }catch (error){
    logger.error(error);
    res.status(500).send({code:500, data: [], error})
  }
})

