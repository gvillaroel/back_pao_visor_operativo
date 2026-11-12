/* eslint-disable array-callback-return */
const log4js = require("log4js");
const asyncHandler = require("../middleware/async");

const configlog4 = require("../log4js.json");

log4js.configure(configlog4);
const logger = log4js.getLogger("CxcecController");
const successResponse = require("../middleware/successResponse");
const { FetchCxcecByID } = require("../repositories/CxcecRepository");

exports.getCxcec = asyncHandler(async (req, res) => {
  logger.info("En metodo getCxcec");

  try {
    const { orderNo, skuId} = req.query;

    const cxcec = await FetchCxcecByID(orderNo, skuId);
    if (cxcec !== null) {
      successResponse(res, { response: cxcec }, "Successful operation");
    } else {
      successResponse(res, {}, "Successful operation");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error });
  }
});

