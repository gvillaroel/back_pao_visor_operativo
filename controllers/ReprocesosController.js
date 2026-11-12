const log4js = require("log4js");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");
const config = require("../log4js.json");
const { FetchErroresUnique, FetchOrdenesWithError } = require("../repositories/CreacionOrden/IntegracionesRepository");
const { ORDER_CREATED } = require("./INT201/ORDER_CREATED");
const { ORDER_UPDATED } = require("./INT201/ORDER_UPDATED");
const { FetchOneOrdenByOrdenNo } = require("../repositories/CreacionOrden/Orden_ventaRepository");
const { SHIPMENT_UPDATED } = require("./INT300/SHIPMENT_UPDATED");
const { UpdateIntegracion, FetchAllIntegraciones, FetchOrdenesWithErrorOrderHeaderKey } = require("../repositories/CreacionOrden/IntegracionesRepository");
const { FetchOneGestor, CreateGestor, UpdateGestor } = require("../repositories/CreacionOrden/GestorRepository");
const { CreateError } = require("../repositories/ErroresRepository");

log4js.configure(config);
const logger = log4js.getLogger("ReprocesosController");

/**
  * Se recuperan los tipos de error que han ocurrido en las inserciones
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.ErroresUnique = asyncHandler(async (req, res) => {
    logger.info("ErroresUnique");

    try {
        // Se recuperan los tipos de error que han ocurrido en las inserciones
        const errores = await FetchErroresUnique();
        clientResponse(res, 200, "Fetched Errores", errores);
    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Se envia un tipo de error y se recuperan las listas de ordenes a reprocesar
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.ListaReprocesoDirigido = asyncHandler(async (req, res) => {
    logger.info("ListaReprocesoDirigido");
    const errorType = req.body.error;
    const page = req.body.page && req.body.page !== "" ? req.body.page : 0;
    try {
        // Se recuperan los tipos de error que han ocurrido en las inserciones
        const errores = await FetchOrdenesWithErrorOrderHeaderKey(errorType, page);
        clientResponse(res, 200, "Fetched Integraciones con errores.", errores);
    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Se envia un tipo de error y se realizan los reprocesos para solventar esos
  * errores
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.ReprocesoDirigidoLotes = asyncHandler(async (req, res) => {
    logger.info("ReprocesoDirigidoLotes");
    const errorType = req.body.error;
    const page = req.body.page && req.body.page !== "" ? req.body.page : 0;
    try {
        // Se recuperan los tipos de error que han ocurrido en las inserciones
        let errores = await FetchOrdenesWithError(errorType, page);
        const erroresPrevios = errores.total;

        logger.info("errores : ", errores.registros.length);

        async function processOrden(orden) {
            try {
                if (orden.Sistema === "INT201") {
                    const existingOrder = await FetchOneOrdenByOrdenNo(orden.JSONSistema.Order.OrderNo);
                    if (existingOrder === null) {
                        await ORDER_CREATED(orden.JSONSistema.Order, orden.IDIntegracion, orden.OrderHeaderKey);
                    }

                    // Revisar que no haya pendientes por procesar NOTA: al final se encuentra la actual
                    const pendientes = await FetchAllIntegraciones(orden.OrderHeaderKey, orden.Sistema);
                    // Reproceso de pendientes y ejecucion de la actual
                    if (pendientes !== undefined && pendientes !== null) {
                        let noProcesada = false;
                        for (const pendiente of pendientes) {
                            if (noProcesada || pendiente.EstatusEjecucion === false) {
                                noProcesada = true;
                                logger.info(`Reproceso INT201 ${pendiente.MessageType}${pendiente.OrderHeaderKey}`);
                                await ORDER_UPDATED(pendiente.JSONSistema.Order, existingOrder, pendiente.IDIntegracion);
                            }
                        }
                    }
                }
                if (orden.Sistema === "INT300") {
                    // Revisar que no haya pendientes por procesar NOTA: al final se encuentra la actual
                    const pendientes = await FetchAllIntegraciones(orden.OrderHeaderKey, orden.Sistema);

                    // Reproceso de pendientes y ejecucion de la actual
                    if (pendientes !== undefined && pendientes !== null) {
                        for (const pendiente of pendientes) {
                            logger.info(`Reproceso INT300 ${pendiente.MessageType}`);
                            response = await SHIPMENT_UPDATED(pendiente.JSONSistema.Shipment, existingOrder, pendiente.IDIntegracion);
                        }
                    }
                }
                if (orden.Sistema === "GESTOR") {
                    const existingGestor = await FetchOneGestor(orden.OrderHeaderKey);

                    if (existingGestor === null) {
                        logger.info("Reproceso GESTOR ");
                        const create = await CreateGestor(orden.JSONSistema);
                        if (create) {
                            await UpdateIntegracion({ EstatusEjecucion: true }, orden.IDIntegracion);
                        }
                    }

                    // UPDATE
                    // Revisar que no haya pendientes por procesar NOTA: al final se encuentra la actual
                    const pendientes = await FetchAllIntegraciones(orden.OrderHeaderKey, orden.Sistema);

                    // Reproceso de pendientes y ejecucion de la actual
                    if (pendientes !== undefined && pendientes !== null) {
                        for (const pendiente of pendientes) {
                            logger.info(`Reproceso Gestor ${pendiente.OrderHeaderKey}`);
                            await UpdateGestor(pendiente.JSONSistema, pendiente.OrderHeaderKey);
                            await UpdateIntegracion({ EstatusEjecucion: true }, pendiente.IDIntegracion);
                        }
                    }
                }
            } catch (error) {
                await CreateError({ json_body: orden, error: error.toString() });
            }
        }

        const promises = errores.registros.map(processOrden);
        await Promise.all(promises);

        errores = await FetchOrdenesWithError(errorType, page);
        const erroresActuales = errores.total;

        clientResponse(res, 200, "Reprocesos Terminados.", { erroresPrevios, erroresActuales });
    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});
