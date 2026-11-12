/* eslint-disable array-callback-return */
const log4js = require('log4js');
const asyncHandler = require('../middleware/async');

const configlog4 = require('../log4js.json');

log4js.configure(configlog4);
const logger = log4js.getLogger('SimplirouteController');
const successResponse = require('../middleware/successResponse');
const { FetchSimpliroute } = require("../repositories/SimplirouteRepository");

exports.getSimpliroute = asyncHandler(async (req, res) => {
  logger.info('En metodo getSimpliroute');

  try {
    const { orderId, sku } = req.params;

    const simpliroute = await FetchSimpliroute(orderId, sku);
    if (simpliroute !== null) {
      successResponse(res, simpliroute , 'Successful operation');
    } else {
      successResponse(res, {}, 'Successful operation', 404);
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error });
  }
});
