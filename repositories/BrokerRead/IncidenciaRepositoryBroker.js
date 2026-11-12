const log4js = require("log4js");
const { BrokerReadPool } = require("../../config/brokerReadPool");
const Schema = require("../../models/init-models");
const configlog = require("../../log4js.json");

log4js.configure(configlog);
const logger = log4js.getLogger("IncidenciaRepository");
const { Incidencias } = Schema.default(BrokerReadPool);

/**
 * Verifica que exista un envío en BD buscando por número de envío.
 *
 * @param OrderLineKey Número de linea para hacer la búsqueda
 * @return incidencias Regresa las incidencias de la BD
 */
exports.FetchIncidenciasByLineaBroker = async (OrderLineKey) => {
    try {
        const incidencias = await Incidencias.findAll({
            where: { OrderLineKey },
            order: [["FchCreacion", "DESC"]],
            attributes: { exclude: ["FchCreacion", "FchActualizacion"] },
            raw: true,
        });
        return incidencias;
    } catch (error) {
        logger.error(error);
        return null;
    }
};
