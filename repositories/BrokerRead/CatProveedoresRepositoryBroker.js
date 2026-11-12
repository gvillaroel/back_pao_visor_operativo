const { BrokerReadPool } = require("../../config/brokerReadPool");
const Schema = require("../../models/init-models");

const { Cat_proveedores } = Schema.default(BrokerReadPool);
/**
 * Lenado de locaciones primera carga
 *
 * @param bulk {ARRAY} Contiene los registros a ingresar
 * @return newBulk regresa registros insertados
 */
exports.BulkProveedoresBroker = async (bulk) => {
  await Cat_proveedores.destroy({ where: {} })
  const newBulk = await Cat_proveedores.bulkCreate(bulk);
  return newBulk;
};

/**
 * Recupera lista de proveedores proveeedor por su pl3ID
 *
 * @param pl3 {string} Contiene la llave que relaciona con gestor
 * @return listProveedores regresa la lista de proveedores
 */
exports.FetchProveedoresByGestorBroker = async (IDProveedor) => {
  const listProveedores = await Cat_proveedores.findOne(
    { where: { IDProveedor: IDProveedor } }
  )
  return listProveedores;
};

/**
 * Recupera todos los proveedores
 *
 * @return proveedores lista de proveedores en BD
 */
exports.FetchProveedoresBroker = async () => {
  const proveedores = await Cat_proveedores.findAll({})
  return proveedores;
};


/**
 * Inserta un nuevo proveedor
 *
 * @param proveedor {JSON} Contiene el body del nuevo proveedor
 * @return newProovedor regresa el registro insertado
 */
exports.createProveedorBroker = async (proveedor) => {
  if (proveedor !== null) {
    const newProveedor = await Cat_proveedores.create(proveedor);
    return newProveedor;
  } else {
    return null
  }
};

/**
 * Actualiza un registro en particular
 *
 * @param id {int} Contiene el id a buscar
 * @param proveedor {JSON} Contiene el body con los cambios
 * @return updated regresa cuantos registros fueron afectados
 */
exports.updateProveedorBroker = async (id, proveedor) => {
  if (id !== null) {
    proveedor.FchActualizacion = new Date()
    const updated = await Cat_proveedores.update(
      proveedor,
      {
        where:
          { IDProveedor: id }
      });
    return updated;
  } else {
    return null
  }
};

/**
 * Elimina un registro
 *
 * @param id {int} Contiene el id a buscar
 * @return deleted regresa el registro eliminado
 */
exports.deleteProveedorBroker = async (id) => {
  if (id !== null) {
    const deleted = await Cat_proveedores.destroy({
      where:
        { IDProveedor: id },
    });
    return deleted;
  } else {
    return null
  }
};