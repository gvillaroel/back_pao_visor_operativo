/* eslint-disable max-len */
const log4js = require("log4js");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");
const config = require("../log4js.json");
const { CreateIntegracion, UpdateIntegracion, FetchAllIntegracionesPendientes } = require("../repositories/CreacionOrden/IntegracionesRepository");
const { FetchOneOrdenByOrdenNo } = require("../repositories/CreacionOrden/Orden_ventaRepository");
const { SHIPMENT_UPDATED } = require("./INT300/SHIPMENT_UPDATED");

log4js.configure(config);
const logger = log4js.getLogger("Controller300");

/**
  * Se valida el tipo de correo que debe mandarse asi como las reglas especificas segun el request recibido por Brocker
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.INT300 = asyncHandler(async (req, res) => {
  logger.info("En metodo INT300");
  const data300 = req.body.Shipment || "";
  const OrderPK = data300?.OrderNo;

  // Validar si la orden existe, si existe se hace update, si no se inserta
  const existingOrder = await FetchOneOrdenByOrdenNo(OrderPK.toString());

  // Agregar Integracion (HISTORICO)
  const integracion = {
    Sistema: "INT300",
    JSONSistema: req.body,
    OrderHeaderKey: existingOrder.OrderHeaderKey,
    MessageType: "300",
  };
  const newIntegracion = await CreateIntegracion(integracion);

  try {
    if (existingOrder !== null) {
      // UPDATE
      // Revisar que no haya pendientes por procesar NOTA: al final se encuentra la actual
      const pendientes = await FetchAllIntegracionesPendientes(existingOrder.OrderHeaderKey, integracion.Sistema);

      // Reproceso de pendientes y ejecucion de la actual
      let response = "";
      if (pendientes !== undefined && pendientes !== null) {
        for (const pendiente of pendientes) {
          logger.info(`Reproceso INT300 ${pendiente.MessageType}`);
          response = await SHIPMENT_UPDATED(pendiente.JSONSistema.Shipment, existingOrder, pendiente.IDIntegracion);
        }
      }

      clientResponse(res, response.code, response.code, response.message, response.data);
    } else {
      // Terminar ejecucion debido a que el registro no se encuentra
      await UpdateIntegracion({ EstatusEjecucion: true }, newIntegracion.IDIntegracion);
      return clientResponse(res, 404, `No se encontraron resultados para la orden ${OrderNo}`, {});
    }
  } catch (error) {
    logger.error(error);
    if (existingOrder !== null) {
      // Registrar error en la bitacora
      await UpdateIntegracion({ error: error.toString() }, newIntegracion.IDIntegracion);
    }
    clientResponse(res, 500, error.toString(), {});
  }
});
