const log4js = require("log4js");

const logger = log4js.getLogger("OrdenesController");
const moment = require("moment");
const { FetchOneIntegracion } = require("../../repositories/CreacionOrden/IntegracionesRepository");

/**
  * Recibe orderno y valida si es posible mandar un nuevo mensaje
  *
  * @param numeroOrden {string} número de orden para filtrar integraciones
  * @param date {date} fecha actual
  *
  */
async function UltimaIntegracion(numeroOrden, date) {
    let existeMensajeMismoMinuto = false;
    const integracion = await FetchOneIntegracion(numeroOrden);

    if (integracion) {
        // Sacar el tiempo de creacion/actualización de la integracion
        const fechaCreacionIntegracion = integracion?.FchCreacion === null ? '' : new Date(moment(new Date(integracion?.FchCreacion)).format('YYYY-MM-DD HH:mm:ss UTC'));
        const fechaActualizacionIntegracion = integracion?.FchActualizacion === null ? '' : new Date(moment(new Date(integracion?.FchActualizacion)).format('YYYY-MM-DD HH:mm:ss UTC'));

        // si son iguales las fechas indica que aun se esta procesando
        if (fechaCreacionIntegracion.getTime() === fechaActualizacionIntegracion.getTime()) {
            logger.warn('Mensaje al mismo segundo, no se manda uno nuevo', numeroOrden);
            existeMensajeMismoMinuto = true;
        }
    }
    return existeMensajeMismoMinuto;
}

module.exports = { UltimaIntegracion };
