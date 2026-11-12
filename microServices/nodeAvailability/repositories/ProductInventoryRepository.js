const db = require("../config/db");
const initModels = require("../models/init-models");
const { QueryTypes } = require("sequelize");

const { Products, InventoryNode, ProductInventory } = initModels(db.sequelize);

/**
 * Busca un registro de inventario por producto y nodo
 * @param {number} idProduct ID del producto
 * @param {number} idNode ID del nodo
 * @returns {Promise<Object|null>}
 */
exports.fetchByProductAndNode = async (idProduct, idNode) => {
  return await ProductInventory.findOne({
    where: {
      id_product: idProduct,
      id_node: idNode,
    },
    raw: true,
  });
};

/**
 * Busca la disponibilidad persistida para un nodo y una lista de SKUs.
 * @param {string|number} centroid Código del nodo
 * @param {Array<string|number>} skus SKUs solicitados
 * @returns {Promise<Array<Object>>}
 */
exports.fetchAvailabilityByCentroidAndSkus = async (centroid, skus) => {
  if (!Array.isArray(skus) || skus.length === 0) return [];

  const { queryGenerator } = db.sequelize.getQueryInterface();
  const productInventoryTable = queryGenerator.quoteTable(ProductInventory.getTableName());
  const productsTable = queryGenerator.quoteTable(Products.getTableName());
  const inventoryNodeTable = queryGenerator.quoteTable(InventoryNode.getTableName());

  return db.sequelize.query(
    `SELECT
      inventory.id_inventory AS key,
      node.node_code AS "centroId",
      product.sku AS "skuId",
      inventory.available_quantity AS "availableQuantity",
      inventory.to_ts AS time
    FROM ${productInventoryTable} AS inventory
    INNER JOIN ${productsTable} AS product ON product.id_product = inventory.id_product
    INNER JOIN ${inventoryNodeTable} AS node ON node.id_node = inventory.id_node
    WHERE node.node_code = :centroid
      AND product.sku IN (:skus)
    ORDER BY product.sku`,
    {
      replacements: {
        centroid: String(centroid).trim(),
        skus: skus.map((sku) => String(sku).trim()),
      },
      type: QueryTypes.SELECT,
    },
  );
};

/**
 * Inserta o actualiza el inventario solo si la fecha recibida es más reciente.
 * Requiere una restricción única sobre (id_product, id_node).
 * @param {Object} data Datos del inventario, incluyendo to_ts
 * @param {Object} [transaction] Transacción opcional de Sequelize
 * @returns {Promise<boolean>} True si se insertó o actualizó el registro
 */
exports.saveInventory = async (data, transaction) => {
  if (!data.to_ts || !Number.isFinite(new Date(data.to_ts).getTime())) {
    throw new Error("Se requiere una fecha to_ts válida para guardar el inventario.");
  }

  const table = db.sequelize.getQueryInterface().queryGenerator.quoteTable(ProductInventory.getTableName());
  const rows = await db.sequelize.query(
    `INSERT INTO ${table} AS inventory
      (id_product, id_node, available_quantity, to_ts, created_at, updated_at)
    VALUES ($idProduct, $idNode, $availableQuantity, $toTs, $now, $now)
    ON CONFLICT (id_product, id_node) DO UPDATE SET
      available_quantity = EXCLUDED.available_quantity,
      to_ts = EXCLUDED.to_ts,
      updated_at = EXCLUDED.updated_at
    WHERE inventory.to_ts IS NULL OR inventory.to_ts < EXCLUDED.to_ts
    RETURNING id_inventory`,
    {
      bind: {
        idProduct: data.id_product,
        idNode: data.id_node,
        availableQuantity: data.available_quantity,
        toTs: data.to_ts,
        now: new Date(),
      },
      transaction,
      type: QueryTypes.SELECT,
    }
  );
  return rows.length > 0;
};
