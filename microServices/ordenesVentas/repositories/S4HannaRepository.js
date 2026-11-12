const db = require('../config/db');
const Schema = require('../models/init-models');

const { S4Hanna } = Schema.default(db.sequelize);

/**
 * Obtiene los registros de S4Hanna de la BD
 *
 * @param cp {string} Contiene el CP a buscar
 * @return fetched regresa la info buscada
 */
exports.FetchS4HannaByID = async (id_s4hanna) => {
  if (id_s4hanna !== null) {
    const fetched = await S4Hanna.findOne({
      where: {
        id_hanna: id_s4hanna,
      },
      attributes: { exclude: ['create_time', 'update_time'] },
      raw: true,
    });
    return fetched;
  }
  return null;
};
