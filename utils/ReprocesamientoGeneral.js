const log4js = require("log4js");
const config = require("../log4js.json");

const { FetchErroresUniqueReprocesar } = require("../repositories/CreacionOrden/IntegracionesRepository");
const { FetchOneOrden } = require("../repositories/CreacionOrden/Orden_ventaRepository");
const { REVISION_INTEGRACION } = require("../controllers/INT201/Revisar_Integraciones");
const { ORDER_CREATED } = require("../controllers/INT201/ORDER_CREATED");
const { ORDER_UPDATED } = require("../controllers/INT201/ORDER_UPDATED");
const { SHIPMENT_UPDATED } = require("../controllers/INT300/SHIPMENT_UPDATED");
const { UpdateIntegracion, FetchAllIntegracionesPendientes } = require("../repositories/CreacionOrden/IntegracionesRepository");
const { FetchOneGestor, CreateGestor, UpdateGestor } = require("../repositories/CreacionOrden/GestorRepository");

log4js.configure(config);
const logger = log4js.getLogger("ReprocesoGeneral");

async function reprocesamientoGenerarlOrdenes(update) {
    let errores = null;
    try {
        errores = await FetchErroresUniqueReprocesar();
        logger.info("Se inicia reprocesamiento General con: ", errores.length);

        const erroresPrevios = errores.length;
        let ok = 0;
        let enError = 0;

        async function processOrden(orden) {
            try {
                if (orden.Sistema === "INT201") {
                    if (update) {
                        // await REVISION_INTEGRACION(orden.JSONSistema, orden.IDIntegracion);
                    } else if (orden.JSONSistema.Order.OrderLines.OrderLine.length > 0) {
                        let existingOrder = await FetchOneOrden(orden.OrderHeaderKey);
                        if (existingOrder === null) {
                            await ORDER_CREATED(orden.JSONSistema.Order, orden.IDIntegracion, orden.OrderHeaderKey);
                            ok += 1;
                        }

                        // Revisar que no haya pendientes por procesar NOTA: al final se encuentra la actual
                        let pendientes = await FetchAllIntegracionesPendientes(orden.OrderHeaderKey, orden.Sistema);
                        // Reproceso de pendientes y ejecucion de la actual
                        if (pendientes !== undefined && pendientes !== null) {
                            const procesarPendiente = async (pendiente) => {
                                logger.info(`Reproceso INT201 ${pendiente.MessageType} ${pendiente.OrderHeaderKey} ${existingOrder}`);
                                await ORDER_UPDATED(pendiente.JSONSistema.Order, existingOrder, pendiente.IDIntegracion);
                            };

                            const batchSize = 10;

                            // Dividir el array en lotes
                            for (let i = 0; i < pendientes.length; i += batchSize) {
                                const batch = pendientes.slice(i, i + batchSize);

                                // Usar el método map para procesar cada pendiente en el lote
                                let promesas = batch.map(procesarPendiente);

                                // Esperar a que todas las promesas del lote actual se resuelvan antes de pasar al siguiente lote
                                await Promise.all(promesas);

                                promesas = null;
                            }
                            ok += 1;
                        }
                        pendientes = null;
                        existingOrder = null;
                    } else {
                        await UpdateIntegracion({ EstatusEjecucion: true }, orden.IDIntegracion);
                    }
                }
                if (orden.Sistema === "INT300") {
                    // Revisar que no haya pendientes por procesar NOTA: al final se encuentra la actual
                    let existingOrder = await FetchOneOrden(orden.OrderHeaderKey);
                    let pendientes = await FetchAllIntegracionesPendientes(orden.OrderHeaderKey, orden.Sistema);

                    // Reproceso de pendientes y ejecucion de la actual
                    if (pendientes !== undefined && pendientes !== null) {
                        for (const pendiente of pendientes) {
                            logger.info(`Reproceso INT300 ${pendiente.MessageType}`);
                            await SHIPMENT_UPDATED(pendiente.JSONSistema.Shipment, existingOrder, pendiente.IDIntegracion);
                        }
                        ok += 1;
                    }
                    pendientes = null;
                    existingOrder = null;
                }
                if (orden.Sistema === "GESTOR") {
                    const existingGestor = await FetchOneGestor(orden.JSONSistema.guia);

                    if (existingGestor === null) {
                        const create = await CreateGestor(orden.JSONSistema);
                        if (create) {
                            await UpdateIntegracion({ EstatusEjecucion: true }, orden.IDIntegracion);
                        }
                    }

                    // UPDATE
                    // Revisar que no haya pendientes por procesar NOTA: al final se encuentra la actual
                    const pendientes = await FetchAllIntegracionesPendientes(existingGestor.guia, orden.Sistema);

                    // Reproceso de pendientes y ejecucion de la actual
                    if (pendientes !== undefined && pendientes !== null) {
                        for (const pendiente of pendientes) {
                            logger.info(`Reproceso Gestor ${existingGestor.guia}`);
                            await UpdateGestor(pendiente.JSONSistema, existingGestor.guia);
                            await UpdateIntegracion({ EstatusEjecucion: true }, pendiente.IDIntegracion);
                        }
                    }
                    pendientes = null;
                    existingGestor = null;
                }
            } catch (error) {
                logger.error(error);
                enError += 1;
                await UpdateIntegracion({ EstatusEjecucion: false, error: error.toString() }, orden.IDIntegracion);
            }
        }

        const promises = errores.map(processOrden);
        await Promise.all(promises);

        errores = await FetchErroresUniqueReprocesar();
        const erroresActuales = errores.length;

        logger.info("Reprocesos Terminados. ", "erroresPrevios:", erroresPrevios, ", erroresActuales:", erroresActuales);
        errores = null;
    } catch (error) {
        logger.error(error);
    } finally {
        errores = null;
    }
}

module.exports = reprocesamientoGenerarlOrdenes;
