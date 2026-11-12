const db = require('../config/db');
const Schema = require('../models/init-models');

const { Incidencia } = Schema.default(db);

/**
 * Crea una Incidencia en BD.
 *
 * @param incidencia {JSON} Información de una nueva incidencia
 * @return newIncidencia Regresa el registro de la integración en BD
 */
exports.CreateIncidencia = async (incidencia) => {
  if (incidencia.action === 'UPDATE') {
    const save = await Incidencia.update(
      incidencia,
      {
        where: {
          WorkOrderID: incidencia.WorkOrderID,
        },
        attributes: {
          exclude: ["fcreacion", "factualizacion"],
        },
      }
    );
    return save;
  } else {
    return Incidencia.create(incidencia);
  }
};
