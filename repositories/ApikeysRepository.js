const db = require("../config/db");
const Schema = require("../models/init-models");

const { Apikeys } = Schema.default(db);

/**
  * Crea una apikey en BD.
  *
  * @param apikey {JSON} informacion de una nueva apikey
  * @return key regresa el registro de la llave en BD
  */
exports.Create = async (apikey) => {
  const key = await Apikeys.create(
    apikey,
  );
  return key;
};

/**
  * Verifica que exista una apikey en BD buscando por key.
  *
  * @param apikey {string} string enviada en los headers de peticiones, se valida que exista en BD
  * @return key regresa el registro de la llave en BD
  */
exports.FetchOneByKey = async (apikey) => {
  const key = await Apikeys.findOne({
    where: { api_key: apikey },
    raw: true,
  });
  return key;
};

/**
  * Verifica que exista una apikey en BD buscando por id.
  *
  * @param apikey {string} string enviada en los headers de peticiones, se valida que exista en BD
  * @return key regresa el registro de la llave en BD
  */
exports.FetchOneById = async (apikey) => {
  const key = await Apikeys.findOne({
    where: { id_key: apikey },
    raw: true,
  });
  return key;
};

/**
  * Regresa todas las apikeys en BD
  *
  * @return keys regresa un arreglo con todas las llaves en BD
  */
exports.FetchAll = async () => {
  const keys = await Apikeys.findAll({
    raw: true,
  });
  return keys;
};

/**
  * Actualiza una apikey en BD.
  *
  * @param apikey {JSON} informacion actualizada de la apikey
  * @return updatedKey regresa el numero de registros afectados
  */
exports.Update = async (apikey) => {
  const updatedKey = await Apikeys.update(
    apikey,
    {
      where: {
        id_key: apikey.id_key,
      },
    },
  );
  return updatedKey;
};

/**
  * Elimina una apikey en BD.
  *
  * @param apikey {JSON} la apikey eliminada
  * @return deletedKey regresa el numero de registros afectados
  */
exports.Delete = async (id_key) => {
  const deletedKey = await Apikeys.destroy({
    where: {
      id_key: id_key,
    },
  });
  return deletedKey;
};
