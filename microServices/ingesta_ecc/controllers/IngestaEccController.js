/* eslint-disable array-callback-return */
const log4js = require('log4js');
const asyncHandler = require('../middleware/async');

const configlog4 = require('../log4js.json');
// const { SaveIngestaEccService } = require('../services/IngestaEccService');
const { CreateIntegracion } = require('../repositories/IntegracionesRepository')

log4js.configure(configlog4);
const logger = log4js.getLogger('IngestaEccController');
const successResponse = require('../middleware/successResponse');
const { SaveEcc } = require('../repositories/IngestaEccRepository');

exports.saveIngestaEcc = asyncHandler(async (req, res) => {
  logger.info('Save ingesta ecc');
  try {
    const integracion = {
      Sistema: 'ECC',
      JSONSistema: req.body.data,
      MessageType: req.body.isUpdate ? 'Update Satelite Ecc' : 'Create Satelite Ecc',
      OrderHeaderKey: req.body.data.remision,
    };
    const newIntegracion = await CreateIntegracion(integracion);
    if (newIntegracion !== null) {
      SaveEcc(req.body);
      successResponse(res, { response: newIntegracion }, 'Successful operation');
    } else {
      successResponse(res, {}, 'Successful operation');
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error });
  }
});