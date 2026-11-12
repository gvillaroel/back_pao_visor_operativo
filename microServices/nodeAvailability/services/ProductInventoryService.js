const log4js = require("log4js");
const db = require("../config/db");
const ProductoRepository = require("../repositories/ProductoRepository");
const InventoryNodeRepository = require("../repositories/InventoryNodeRepository");
const ProductInventoryRepository = require("../repositories/ProductInventoryRepository");

const logger = log4js.getLogger("ProductInventoryService");

class ProductInventoryService {
  /**
   * Procesa y almacena en base de datos las disponibilidades de inventario
   * recibidas en el mensaje de Pub/Sub.
   *
   * @param {Object} ivMessage Instancia de IVAvailabilityMessage
   * @returns {Promise<Object>} Resumen del procesamiento
   */
  async processAndStoreInventory(ivMessage) {
    if (!ivMessage) {
      logger.warn("[ProductInventoryService] Mensaje inválido o vacio.");
      return { processedCount: 0, skippedCount: 0 };
    }

    let processedCount = 0;
    let skippedCount = 0;

    const transaction = await db.sequelize.transaction();

    try {
      const { id, data } = ivMessage;
      const { productId, shipNode, currentAvailability } = data;
      if (!productId) {
        logger.warn(`[ProductInventoryService] Mensaje sin 'productId'. Se omite. ID del mensaje: ${id}`);
        skippedCount += 1;
        return { processedCount, skippedCount };
      }

      // 1. Buscar el producto por productId (coincide con sku en tabla products)
      const product = await ProductoRepository.fetchBySku(productId);
      if (!product) {
        logger.warn(
          `[ProductInventoryService] Producto con Sku '${productId}' no existe en la base de datos (tabla products). Se omite el procesamiento de este mensaje. ID del mensaje: ${id}`,
        );
        skippedCount += 1;
        return { processedCount, skippedCount };
      }
      const idProducto = product.id_product;

      // 2. Buscar el nodo de inventario por shipNode (node_code en tabla inventory_node)
      const node = await InventoryNodeRepository.fetchByNodeCode(shipNode);
      if (!node) {
        logger.warn(
            `[ProductInventoryService] Nodo con node_code '${shipNode}' no existe en la base de datos (tabla inventory_node). Se omite el registro para producto '${productId}'. ID del mensaje: ${id}`,
        );
        skippedCount += 1;
        return { processedCount, skippedCount };
      }
      const idNode = node.id_node;

      const { availableQuantity, toTs } = currentAvailability;

      const inventoryData = {
        id_product: idProducto,
        id_node: idNode,
        available_quantity: availableQuantity,
        to_ts: toTs,
      };

      // 3. Upsert en product_inventory
      const saved = await ProductInventoryRepository.saveInventory(inventoryData, transaction);
      if (saved) {
        processedCount += 1;
      } else {
        skippedCount += 1;
        logger.info(
          `[ProductInventoryService] Se omitió el inventario de '${productId}' en '${shipNode}': la fecha recibida no es más reciente.`,
        );
      }

      await transaction.commit();
      logger.info(
        `[ProductInventoryService] Persistencia completada. Registros actualizados/insertados: ${processedCount}, omitidos: ${skippedCount}.`,
      );

      return { processedCount, skippedCount };
    } catch (error) {
      await transaction.rollback();
      logger.error(
        `[ProductInventoryService] Error en transacción al almacenar inventarios en BD: ${error.message}`,
      );
      throw error;
    }
  }
}

module.exports = new ProductInventoryService();
