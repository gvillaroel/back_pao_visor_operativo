const db = require("../config/db");
const Schema = require("../models/init-models");

const { Integraciones } = Schema.default(db);

/**
 * Crea una integración en BD.
 *
 * @param integracion {JSON} Información de una nueva integración
 * @return newIntegracion Regresa el registro de la integración en BD
 */
exports.CreateIntegracion = async (integracion) => Integraciones.create(integracion);

/**
 * Aprueba o marca como error una integracion
 * @param id
 * @param error
 * @returns {Promise<void>}
 * @constructor
 */
exports.UpdateIntegracion = async (id, error) => {
    try {
        await Integraciones.update({
            EstatusEjecucion: !error,
            error: error ? error.stack : null,
        }, {
            where: {
                IDIntegracion: id,
            },
        });
    } catch (err) {
        console.error(err);
    }
};
