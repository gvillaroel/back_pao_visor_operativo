const { BrokerReadPool } = require("../../config/brokerReadPool");
const Schema = require("../../models/init-models");

const { Gestor } = Schema.default(BrokerReadPool);

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposGestorBroker = async () => {
  const campos = Gestor.getAttributes();
  const camposSinPK = Object.keys(campos).filter((key) => campos[key].primaryKey === undefined);
  return camposSinPK;
};

/**
  * Crea un registro de  Gestor  en BD.
  *
  * @param Gestor {JSON} informacion de una nueva Gestor
  * @return newGestor regresa el registro de la Gestor en BD
  */
exports.CreateGestorBroker = async (json, t) => {
  json.pl3ID = parseInt(json.pl3ID).toString();

  const newGestor = await Gestor.create(
    json,
    { transaction: t },
  );
  return newGestor;
};

/**
  * Verifica que exista una Gestor en BD buscando por numero de Gestor.
  *
  * @param guia {string} Numero de la guia
  * @return Gestor regresa la Gestor de la BD
  */
exports.FetchOneGestorBroker = async (guia) => {
  const FetchedGestor = await Gestor.findOne({
    where: { guia },
    attributes: { exclude: ["FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  return FetchedGestor;
};

/**
  * Verifica que exista una Gestor en BD buscando por numero de Gestor.
  *
  * @param OrderNo {string} Numero de la Gestor para poder hacer la busqueda
  * @return Gestor regresa la Gestor de la BD
  */
exports.FetchOneGestorByGestorNoBroker = async (OrderNo) => {
  const Gestor = await Gestor.findOne({
    where: { OrderNo },
    attributes: { exclude: ["FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  return Gestor;
};

/**
  * Regresa todas las Gestores en BD
  *
  * @return Gestores regresa un arreglo con todas las Gestores en BD
  */
exports.FetchAllGestoresBroker = async () => {
  const Gestores = await Gestor.findAll({
    raw: true,
  });
  return Gestores;
};

/**
  * Actualiza una Gestor en BD.
  *
  * @param Gestor {JSON} informacion actualizada de la Gestor
  * @return updatedGestor regresa el numero de registros afectados
  */
exports.UpdateGestorBroker = async (fieldsToUpdate, guia, t) => {
  fieldsToUpdate.update_time = new Date();
  fieldsToUpdate.pl3ID = parseInt(fieldsToUpdate.pl3ID).toString();
  const updatedGestor = await Gestor.update(
    fieldsToUpdate,
    {
      where: {
        guia,
      },
    },
    { transaction: t },
  );
  return updatedGestor;
};

/**
  * Elimina una Gestor en BD.
  *
  * @param guia {string} es el numero de la Gestor que se quiere eliminar
  * @return deletedOrder regresa el numero de registros afectados
  */
exports.DeleteBroker = async (guia) => {
  const deletedOrder = await Gestor.destroy({
    where: {
      guia,
    },
  });
  return deletedOrder;
};
