const log4js = require("log4js");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");
const config = require("../log4js.json");
const { CreateIntegracion, UpdateIntegracion, FetchAllIntegracionesPendientes } = require("../repositories/CreacionOrden/IntegracionesRepository");
const { FetchOneGestor, CreateGestor, UpdateGestor } = require("../repositories/CreacionOrden/GestorRepository");
const db = require("../config/db");

log4js.configure(config);
const logger = log4js.getLogger("ControllerGestor");

/**
  * Se valida el tipo de correo que debe mandarse asi como las reglas especificas segun el request recibido por Brocker
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.INTGestor = asyncHandler(async (req, res) => {
    logger.info("En metodo INTGestor");
    // Inicia una nueva transacción
    const transaction = await db.transaction();
    const dataGestor = req.body || "";

    // Agregar Integracion (HISTORICO)
    const integracion = {
        Sistema: "GESTOR",
        JSONSistema: dataGestor,
        OrderHeaderKey: dataGestor.guia,
        MessageType: "GESTOR",
    };
    const newIntegracion = await CreateIntegracion(integracion);

    try {
        // Validar si la guia existe, si existe se hace update, si no se inserta
        const existingGestor = await FetchOneGestor(dataGestor.guia);

        if (existingGestor !== null) {
            // UPDATE
            // Revisar que no haya pendientes por procesar NOTA: al final se encuentra la actual
            const pendientes = await FetchAllIntegracionesPendientes(dataGestor.guia, integracion.Sistema);

            // Reproceso de pendientes y ejecucion de la actual
            let response = "";
            if (pendientes !== undefined && pendientes !== null) {
                for (const pendiente of pendientes) {
                    logger.info(`Reproceso Gestor ${dataGestor.guia}`);
                    delete pendiente.JSONSistema.guia;
                    response = await UpdateGestor(pendiente.JSONSistema, dataGestor.guia);
                    // Registrar que se ejecuto el cambio en la bitacora
                    await UpdateIntegracion({ EstatusEjecucion: true }, pendiente.IDIntegracion, transaction);
                }
            }

            // Confirma la transacción
            await transaction.commit();

            clientResponse(res, 200, "Guia Actualizada.", response);
        } else {
            // Se crea la GUIA
            const guiaCreated = await CreateGestor(dataGestor);

            // Registrar que se ejecuto el cambio en la bitacora
            await UpdateIntegracion({ EstatusEjecucion: true }, newIntegracion.IDIntegracion, transaction);
            // Confirma la transacción
            await transaction.commit();

            clientResponse(res, 200, "Guia Creada.", guiaCreated);
        }
    } catch (error) {
        logger.error(error);
        await transaction.rollback();
        // Registrar error en la bitacora
        await UpdateIntegracion({ error: error.toString() }, newIntegracion.IDIntegracion);
        clientResponse(res, 500, error.toString(), {});
    }
});
