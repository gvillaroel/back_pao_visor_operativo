/* eslint-disable array-callback-return */
// const https = require('node:https');
// const axios = require('axios');
const log4js = require('log4js');
const successResponse = require('../middleware/successResponse');
const asyncHandler = require('../middleware/async');

const { IngestaMdrService } = require('../services/MdrService');
const configlog4 = require('../log4js.json');
log4js.configure(configlog4);
const logger = log4js.getLogger('MdrController');
exports.saveMdr = asyncHandler(async (req, res) => {
  try {
    const response = await IngestaMdrService(req, res);
    successResponse(res, { response: response }, 'Successful operation');
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error: error.toString() });
  }
});
