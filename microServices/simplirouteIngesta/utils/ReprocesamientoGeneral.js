const log4js = require("log4js");
const config = require("../log4js.json");

const { FetchErroresUniqueReprocesar } = require("../repositories/IntegracionesRepository");
const { UpdateIntegracion } = require("../repositories/IntegracionesRepository");
const { SaveSimpliroute } = require('../repositories/SimplirouteRepository');
const { FetchOneSimpliroute } = require('../repositories/SimplirouteRepository');

log4js.configure(config);
const logger = log4js.getLogger("ReprocesoSimpliroute");

async function reprocesamientoSimpliroute(update) {
    let errores = null;
    try {
        errores = await FetchErroresUniqueReprocesar();
        logger.info("Se inicia reprocesamiento Simpliroute con: ", errores.length);

        const erroresPrevios = errores.length;
        let ok = 0;
        let enError = 0;
        let lista = []

        async function processOrden(orden) {
            
            try {
                if (orden.Sistema === "SIMPLIROUTE") {
                    if (update) {
                        // await REVISION_INTEGRACION(orden.JSONSistema, orden.IDIntegracion);
                    } else if (orden.JSONSistema) {
                        let existingOrder = await FetchOneSimpliroute(orden.OrderHeaderKey);

                        if (existingOrder === null && lista.indexOf(orden.JSONSistema.reference)===-1) {
                            console.log(lista)
                            lista.push(orden.JSONSistema.reference)
                            await SaveSimpliroute(orden.JSONSistema);
                            ok += 1;
                            await UpdateIntegracion({ EstatusEjecucion: true }, orden.IDIntegracion);
                        }
                        else{
                            await UpdateIntegracion({ EstatusEjecucion: true }, orden.IDIntegracion);
                        }

                        pendientes = null;
                        existingOrder = null;
                    } else {
                        await UpdateIntegracion({ EstatusEjecucion: true }, orden.IDIntegracion);
                    }
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

module.exports = reprocesamientoSimpliroute;
