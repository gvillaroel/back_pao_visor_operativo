const db = require('../config/db');
const Schema = require('../models/init-models');

const { Integraciones } = Schema.default(db);


/**
 * Crea una integración en BD.
 *
 * @param integracion {JSON} Información de una nueva integración
 * @return newIntegracion Regresa el registro de la integración en BD
 */
exports.CreateIntegracion = async (integracion) => {
    return Integraciones.create(integracion);
};
