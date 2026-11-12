const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { Producto } = Schema.default(db);

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposProducto = async () => {
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
exports.CreateProducto = async (producto, t) => {
  const newProducto = await Producto.create(producto, { transaction: t });
  return newProducto;
};

/**
 * Verifica que exista un producto en BD buscando por ID de producto.
 *
 * @param ItemID {string} ID del producto para hacer la búsqueda
 * @return producto Regresa el producto de la BD
 */
exports.FetchOneProductoByLinea = async (OrderLineKey) => {
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
exports.FetchOneProducto = async (ItemID) => {
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
exports.FetchAllProductos = async () => {
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
exports.UpdateProducto = async (fieldsToUpdateProducto, OrderLineKey, ItemID, t) => {
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
};

/**
 * Elimina un producto en BD.
 *
 * @param ItemID {string} Es el ID del producto que se quiere eliminar
 * @return deletedProducto Regresa el número de registros afectados
 */
exports.DeleteProducto = async (ItemID) => {
  const deletedProducto = await Producto.destroy({
    where: {
      ItemID: ItemID
    }
  });
  return deletedProducto;
};
