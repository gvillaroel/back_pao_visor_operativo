const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { OrdenVenta } = Schema.default(db);

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposOrdenVenta = async () => {
  const campos = OrdenVenta.getAttributes();
  const camposSinPK = Object.keys(campos).filter((key) => campos[key].primaryKey === undefined);
  return camposSinPK;
};

/**
  * Crea una Orden de venta en BD.
  *
  * @param orden {JSON} informacion de una nueva orden
  * @return newOrden regresa el registro de la orden en BD
  */
exports.CreateOrden = async (orden, t) => {
  const newOrden = await OrdenVenta.create(
    orden,
    { transaction: t },
  );
  return newOrden;
};

/**
  * Verifica que exista una orden en BD buscando por numero de orden.
  *
  * @param OrdenNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrdenNum = async (ordenNum) => {
  const orden = await OrdenVenta.findOne({
    where: { OrderNo: ordenNum },
    attributes: { exclude: ["FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  return orden;
};

/**
  * Verifica que exista una orden en BD buscando por OrderHeaderKey.
  *
  * @param OrdenNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrden = async (OrderHeaderKey) => {
  const orden = await OrdenVenta.findOne({
    where: { OrderHeaderKey },
    attributes: { exclude: ["FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  return orden;
};

/**
  * Verifica que exista una orden en BD buscando por numero de orden.
  *
  * @param OrderNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrdenByOrdenNo = async (OrderNo) => {
  const orden = await OrdenVenta.findOne({
    where: { OrderNo },
    attributes: { exclude: ["FchCreacion", "FchActualizacion"] },
    raw: true,
  });
  return orden;
};

/**
  * Regresa todas las ordenes en BD
  *
  * @return ordenes regresa un arreglo con todas las ordenes en BD
  */
exports.FetchAllOrdenes = async () => {
  const ordenes = await OrdenVenta.findAll({
    raw: true,
  });
  return ordenes;
};

/**
  * Actualiza una Orden en BD.
  *
  * @param orden {JSON} informacion actualizada de la orden
  * @return updatedOrden regresa el numero de registros afectados
  */
exports.UpdateOrden = async (fieldsToUpdate, OrderHeaderKey, t) => {
  fieldsToUpdate.update_time = new Date();
  const updatedOrden = await OrdenVenta.update(
    fieldsToUpdate,
    {
      where: {
        OrderHeaderKey,
      },
    },
    { transaction: t },
  );
  return updatedOrden;
};

/**
  * Elimina una Orden en BD.
  *
  * @param OrderHeaderKey {string} es el numero de la orden que se quiere eliminar
  * @return deletedOrder regresa el numero de registros afectados
  */
exports.Delete = async (OrderHeaderKey) => {
  const deletedOrder = await OrdenVenta.destroy({
    where: {
      OrderHeaderKey,
    },
  });
  return deletedOrder;
};
