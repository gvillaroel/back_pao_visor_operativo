/* eslint-disable array-callback-return */
const log4js = require("log4js");
const asyncHandler = require("../middleware/async");

const configlog4 = require("../log4js.json");
const { SaveXd } = require("../repositories/XdRepository");
const { InsertXd } = require("../services/XdServices");
const successResponse = require("../middleware/successResponse");
const { CreateIntegracion, UpdateIntegracion } = require("../repositories/IntegracionesRepository");

log4js.configure(configlog4);
const logger = log4js.getLogger("XdController");

exports.saveXd = asyncHandler(async (req, res) => {
  logger.info("En metodo saveXd");

  try {
    const integracion = {
      Sistema: "XD",
      JSONSistema: req.body.data ?? req.body.result,
      // eslint-disable-next-line no-nested-ternary
      MessageType: req.body.onlyCheck ? "Consulta Satelite XD" : req.body.isUpdate ? "Update Satelite XD" : "Create Satelite XD",
    };
    const newIntegracion = await CreateIntegracion(integracion);
    if (newIntegracion !== null) {
      successResponse(res, { response: newIntegracion }, "Successful operation");
      if (!req.body.onlyCheck) {
        await InsertXd({
                        id: newIntegracion.dataValues.IDIntegracion,
                        data: integracion.JSONSistema,
                        isUpdate: req.body.isUpdate,
                       }, res);
      } else {
        await UpdateIntegracion(newIntegracion.dataValues.IDIntegracion, null);
      }
    } else {
      successResponse(res, {}, "No pudo crearse el registro en integraciones", 500);
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error });
  }
});

exports.persistXd = asyncHandler(async (req, res) => {
  logger.info("En metodo persistir tabla XD");

  try {
    const newXd = await SaveXd(req.body)
    if (newXd !== null) {
      successResponse(res, { response: newXd }, "Successful operation");
    } else {
      successResponse(res, {}, "Successful operation");
    }
  } catch (error) {
    logger.error(error);
  }
});
