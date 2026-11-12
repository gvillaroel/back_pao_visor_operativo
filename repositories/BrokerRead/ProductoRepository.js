const { BrokerReadPool } = require("../../config/brokerReadPool");
const Schema = require("../../models/init-models");

const { Producto } = Schema.default(BrokerReadPool);

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposProductoBroker = async () => {
  let campos = Producto.getAttributes()
  let camposSinPK = Object.keys(campos).filter(key => campos[key].primaryKey === undefined)
  return camposSinPK
};

/**
 * Crea un producto en BD.
 *
 * @param producto {JSON} Información de un nuevo producto
 * @return newProducto Regresa el registro del producto en BD
 */
exports.CreateProductoBroker = async (producto, t) => {
  try {
    const newProducto = await Producto.create(producto, { transaction: t });
    return newProducto;
  } catch (error) {
    throw error
  }
};

/**
 * Verifica que exista un producto en BD buscando por ID de producto.
 *
 * @param ItemID {string} ID del producto para hacer la búsqueda
 * @return producto Regresa el producto de la BD
 */
exports.FetchOneProductoByLineaBroker = async (OrderLineKey) => {
  OrderLineKey = OrderLineKey || null
  const producto = await Producto.findOne({
    where: { OrderLineKey: OrderLineKey },
    attributes: { exclude: ['id_producto', 'OrderLineKey', 'FchCreacion', 'FchActualizacion'] },
    raw: true
  });
  return producto;
};

/**
 * Verifica que exista un producto en BD buscando por ID de producto.
 *
 * @param ItemID {string} ID del producto para hacer la búsqueda
 * @return producto Regresa el producto de la BD
 */
exports.FetchOneProductoBroker = async (ItemID) => {
  ItemID = ItemID || null
  const producto = await Producto.findOne({
    where: { ItemID: ItemID },
    raw: true
  });
  return producto;
};

/**
 * Regresa todos los productos en BD.
 *
 * @return productos Regresa un arreglo con todos los productos en BD
 */
exports.FetchAllProductosBroker = async () => {
  const productos = await Producto.findAll({
    raw: true
  });
  return productos;
};

/**
 * Actualiza un producto en BD.
 *
 * @param producto {JSON} Información actualizada del producto
 * @return updatedProducto Regresa el número de registros afectados
 */
exports.UpdateProductoBroker = async (fieldsToUpdateProducto, OrderLineKey, ItemID, t) => {
  try {
    const updatedProducto = await Producto.update(
      fieldsToUpdateProducto,
      {
        where: {
          OrderLineKey: OrderLineKey,
          ItemID: ItemID
        }
      },
      { transaction: t }
    );
    return updatedProducto;
  } catch (error) {
    throw error
  }
};

/**
 * Elimina un producto en BD.
 *
 * @param ItemID {string} Es el ID del producto que se quiere eliminar
 * @return deletedProducto Regresa el número de registros afectados
 */
exports.DeleteProductoBroker = async (ItemID) => {
  const deletedProducto = await Producto.destroy({
    where: {
      ItemID: ItemID
    }
  });
  return deletedProducto;
};
