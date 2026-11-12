/* eslint-disable array-callback-return */
const log4js = require('log4js');
const asyncHandler = require('../middleware/async');

const configlog4 = require('../log4js.json');
const { FetchXdByID } = require('../repositories/XdRepository');

log4js.configure(configlog4);
const logger = log4js.getLogger('XdController');
const successResponse = require('../middleware/successResponse');

exports.getXd = asyncHandler(async (req, res) => {
  logger.info('En metodo getXD');

  try {
    const { orderNo, sku } = req.params;

    const xd = await FetchXdByID({ remission: orderNo, sku });
    if (xd !== null) {
      successResponse(res, xd, 'Successful operation');
    } else {
      successResponse(res, {}, 'No se encontró info para esa order y ese sku', 404);
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error });
  }
});
