/* eslint-disable max-len */
const log4js = require("log4js");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");
const config = require("../log4js.json");
const { CreateIntegracion, UpdateIntegracion, FetchAllIntegracionesPendientes } = require("../repositories/CreacionOrden/IntegracionesRepository");
const { FetchOneOrdenNum, FetchOneOrden, FetchOneOrdenByOrdenNo } = require("../repositories/CreacionOrden/Orden_ventaRepository");
const { ORDER_CREATED } = require("./INT201/ORDER_CREATED");
const { ORDER_UPDATED } = require("./INT201/ORDER_UPDATED");

log4js.configure(config);
const logger = log4js.getLogger("Controller201");

/**
  * Se valida el tipo de correo que debe mandarse asi como las reglas especificas segun el request recibido por Brocker
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.INT201 = asyncHandler(async (req, res) => {
  logger.info("En metodo INT201");
  const data201 = req.body.Order || "";
  let OrderPK = data201?.OrderLines?.OrderLine[0]?.OrderHeaderKey;
  if (OrderPK === undefined || OrderPK === null || OrderPK === "") {
    OrderPK = data201.OrderHeaderKey;
  }
  if (OrderPK === undefined || OrderPK === null || OrderPK === "") {
    const newOrden = await FetchOneOrdenNum(data201.OrderNo);
    OrderPK = newOrden.OrderHeaderKey;
  }

  // Agregar Integracion (HISTORICO)
  const integracion = {
    Sistema: "INT201",
    JSONSistema: req.body,
    OrderHeaderKey: OrderPK,
    MessageType: data201.MessageType,
  };
  const newIntegracion = await CreateIntegracion(integracion);

  try {
    // Validar si la orden existe, si existe se hace update, si no se inserta
    const existingOrder = await FetchOneOrden(OrderPK);
    if (existingOrder === null) {
      await FetchOneOrdenByOrdenNo(data201.OrderNo.toString());
    }

    if (existingOrder === null) {
      // CREATE
      const response = await ORDER_CREATED(data201, newIntegracion.IDIntegracion, OrderPK);
      clientResponse(res, response.code, response.message, response.data);
    } else {
      // UPDATE

      // Revisar que no haya pendientes por procesar NOTA: al final se encuentra la actual
      const pendientes = await FetchAllIntegracionesPendientes(OrderPK, integracion.Sistema);

      // Reproceso de pendientes y ejecucion de la actual
      let response = "";
      if (pendientes !== undefined && pendientes !== null) {
        for (const pendiente of pendientes) {
          logger.info(`Reproceso INT201 ${pendiente.MessageType}`);
          response = await ORDER_UPDATED(pendiente.JSONSistema.Order, existingOrder, pendiente.IDIntegracion);
        }
      }

      clientResponse(res, response.code, response.message, response.data);
    }
  } catch (error) {
    logger.error(error);
    // Registrar error en la bitacora
    await UpdateIntegracion({ error: error.toString() }, newIntegracion.IDIntegracion);
    clientResponse(res, 500, error.toString(), {});
  }
});
