/* eslint-disable array-callback-return */
const log4js = require('log4js');
const asyncHandler = require('../middleware/async');

const configlog4 = require('../log4js.json');
const {
  CreateIntegration,
} = require('../repositories/IntegracionesRepository');

log4js.configure(configlog4);
const logger = log4js.getLogger('SiebelController');
const successResponse = require('../middleware/successResponse');

exports.postSiebel = asyncHandler(async (req, res) => {
  logger.info('Save Siebel');
  try {
    const integration = {
      Sistema: 'SIEBEL',
      JSONSistema: req.body,
      MessageType: 'ORDER_SCHEDULED',
      OrderHeaderKey: null,
      EstatusEjecucion: false,
    };
    const newIntegration = await CreateIntegration(integration);
    if (newIntegration !== null) {
      successResponse(res, newIntegration);
    } else {
      successResponse(res, {});
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error });
  }
});
