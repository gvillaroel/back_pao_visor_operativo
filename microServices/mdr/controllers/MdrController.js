/* eslint-disable array-callback-return */
// const https = require('node:https');
// const axios = require('axios');
const log4js = require('log4js');
const successResponse = require('../middleware/successResponse');
const asyncHandler = require('../middleware/async');

const configlog4 = require('../log4js.json');
const { FetchMdrById } = require('../repositories/MdrRepository');

log4js.configure(configlog4);
const logger = log4js.getLogger('MdrController');

exports.getMdr = asyncHandler(async (req, res) => {
  logger.info('En metodo getMdrById');

  try {
    const { event } = req.params;

    const mdr = await FetchMdrById(event);
    if (mdr !== null) {
      successResponse(res, { eventSummary: mdr }, 'Successful operation');
    } else {
      successResponse(res, {}, 'Successful operation.');
    }
  } catch (error) {
    console.error(" Error Cont. " + error)
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error: error.toString() });
  }
});
