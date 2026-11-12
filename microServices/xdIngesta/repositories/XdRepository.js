const db = require('../config/db');
const Schema = require('../models/init-models');

const { Xd } = Schema.default(db);
const { UpdateIntegracion } = require('../repositories/IntegracionesRepository')
/**
 * Obtiene una estructura que json que hace match con el modelo XD
 *
 * @param body {xd} Contiene el json con la estructura del modelo XD
 * @return regresa el modelo persistido
 */

exports.SaveXd = async (payload) => {
  try{
    const [instance, created] = await Xd.findOrCreate({
        where: {
          num_remision: payload.data.num_remision,
          SKU_cve: payload.data.SKU_cve,
        },
        defaults: payload.data,
    });
    if (!created) {
        instance.update(payload.data);
    }
    await UpdateIntegracion(payload.id)
    return instance
  }catch (error){
    console.error(error)
    await UpdateIntegracion(payload.id, error)
  }
};

