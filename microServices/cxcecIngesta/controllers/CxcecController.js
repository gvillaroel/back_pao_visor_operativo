/* eslint-disable array-callback-return */
const log4js = require("log4js");
const asyncHandler = require("../middleware/async");

const configlog4 = require("../log4js.json");

log4js.configure(configlog4);
const logger = log4js.getLogger("CxcecController");
const successResponse = require("../middleware/successResponse");
const { CreateIntegracion } = require('../repositories/IntegracionesRepository')
const { InsertCxcec } = require("../services/CxcecServices");


exports.saveCxcec = asyncHandler(async (req, res) => {
  logger.info("Save Cxcec");
  try {
    const integracion = {
      Sistema: "CXCEC",
      JSONSistema: req.body,
      MessageType: "Satelite Cxcec",
      OrderHeaderKey: req.body.order.orderId,
    };
    const newIntegracion = await CreateIntegracion(integracion)
    if (newIntegracion !== null) {
      successResponse(res, { response: newIntegracion }, "Successful operation");
      await InsertCxcec({id: newIntegracion.dataValues.IDIntegracion, data: integracion.JSONSistema, isUpdate: req.body.isUpdate}, res)

    } else {
      successResponse(res, {}, "Successful operation");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error: error.toString() });
  }
});
