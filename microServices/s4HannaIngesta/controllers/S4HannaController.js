/* eslint-disable array-callback-return */
const log4js = require("log4js");
const successResponse = require("../middleware/successResponse");
const asyncHandler = require("../middleware/async");

const configlog4 = require("../log4js.json");
const {
  CreateIntegracion,
} = require("../repositories/IntegracionesRepository");
const { SaveS4Hanna } = require("../repositories/S4HannaRepository");

log4js.configure(configlog4);
const logger = log4js.getLogger("S4HannaController");

exports.saveS4Hanna = asyncHandler(async (req, res) => {
  logger.info("Buscar order headerKey");
  let NumeroOrden = null;
  if (req.body.data.length > 0) {
    NumeroOrden = req.body.data[0].remision;
  }

  logger.info("Save S4Hanna");
  try {
    const integracion = {
      Sistema: "S4HANNA",
      JSONSistema: req.body.data,
      OrderHeaderKey: NumeroOrden,
      MessageType: req.body.isUpdate
        ? "Update Satelite s4Hanna"
        : "Create Satelite s4Hanna",
    };
    const newIntegracion = await CreateIntegracion(integracion);
    if (newIntegracion !== null) {
      await SaveS4Hanna(req.body);
      successResponse(
        res,
        { response: newIntegracion },
        "Successful operation",
      );
    } else {
      successResponse(res, {}, "Successful operation");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error });
  }
});

exports.persistHanna = asyncHandler(async (req, res) => {
  logger.info("En metodo persistir tabla Ecc");
  try {
    const newS4Hanna = await SaveS4Hanna(req.body);
    if (newS4Hanna !== null) {
      successResponse(res, { response: "Ok" }, "Successful operation");
    } else {
      successResponse(res, {}, "Successful operation");
    }
  } catch (error) {
    logger.error(error);
  }
});
