/* eslint-disable array-callback-return */
const log4js = require('log4js');
const asyncHandler = require('../middleware/async');

const configlog4 = require('../log4js.json');

log4js.configure(configlog4);
const logger = log4js.getLogger('SimplirouteController');
const successResponse = require('../middleware/successResponse');
const { CreateIntegracion, UpdateIntegracion } = require('../repositories/IntegracionesRepository')
const { SaveSimpliroute } = require('../repositories/SimplirouteRepository');

exports.saveSimpliroute = asyncHandler(async (req, res) => {
  logger.info("Save simpliroute");
  try {
    const integracion = {
      Sistema: "SIMPLIROUTE",
      JSONSistema: req.body,
      OrderHeaderKey: req.body.reference,
      MessageType: "Satelite Simpliroute",
      EstatusEjecucion: true,
      OrderHeaderKey: req.body.extra_field_values?.nro_remision,
    };
    const newIntegracion = await CreateIntegracion(integracion);
    if (newIntegracion !== null) {
      const result = await SaveSimpliroute(req.body);
      if (result == 1) {
        successResponse(res, { response: newIntegracion }, "Successful operation");
      } else {
        await UpdateIntegracion(newIntegracion.dataValues.IDIntegracion, `No pudo crearse el registro en Simpliroute. Error: ${result}`);
        successResponse(res, {}, "No pudo crearse el registro en Simpliroute", 500);
      }
    } else {
      successResponse(res, {}, "Successful operation");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error });
  }
});
