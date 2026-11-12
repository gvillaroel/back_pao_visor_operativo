const db = require("../config/db");
const Schema = require("../models/init-models");

const { Gestor } = Schema.default(db);

/**
 * Obtiene los registros de Gestor de la BD
 *
 * @param cp {string} Contiene el CP a buscar
 * @return fetched regresa la info buscada
 */
exports.FetchGestorByID = async (guia) => {
  if (guia !== null) {
    const fetched = await Gestor.findOne({
      where: {
        guia: guia,
      },
      attributes: { exclude: ["create_time", "update_time"] },
      raw: true,
    });
    return fetched;
  }
  return null;
};
