const db = require("../config/db");
const Schema = require("../models/init-models");

const { errores } = Schema.default(db);

/**
  * Crea una apikey en BD.
  *
  * @param error {JSON} informacion de un nuevo error
  * @return newerror regresa el registro de la llave en BD
  */
exports.CreateError = async (error) => {
    const newerror = await errores.create(
        error
    );
    return newerror;
};

/**
  * Verifica que exista un error en BD buscando por key.
  *
  * @param id_eror {string} id del error
  * @return key regresa el registro del error en BD
  */
exports.FetchOneByIderror = async (id_eror) => {
    try {
        const error = await errores.findOne({
            where: { id_eror: id_eror },
            raw: true
        });
        return error;
    } catch (err) {
        console.log(err)
    }
};

/**
  * Regresa todos los errores en BD
  *
  * @return errores regresa un arreglo con todos los errores en BD
  */
exports.FetchAll = async () => {
    const errores = await errores.findAll({
        raw: true
    });
    return errores;
};

/**
  * Actualiza un error en BD.
  *
  * @param error {JSON} informacion actualizada del error
  * @return updatederror regresa el numero de registros afectados
  */
exports.Update = async (error) => {
    const updatederror = await errores.update(
        error,
        {
            where: {
                id_error: error.id_error
            }
        }
    );
    return updatederror;
};

/**
  * Elimina un error en BD.
  *
  * @param id_error {int} el id del error 
  * @return deletederror regresa el numero de registros afectados
  */
exports.Delete = async (id_error) => {
    const deletederror = await errores.destroy({
        where: {
            id_error: id_error
        }
    });
    return deletederror;
};
