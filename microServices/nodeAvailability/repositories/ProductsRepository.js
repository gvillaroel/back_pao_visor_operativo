const db = require("../config/db");
const initModels = require("../models/init-models");

const { Products } = initModels(db.sequelize);

/**
 * Busca un producto en BD a través de su SKU
 * @param {string} sku SKU del producto
 * @returns {Promise<Object|null>} Registro del producto o null
 */
exports.fetchBySku = async (sku) => {
  if (!sku) return null;
  const product = await Products.findOne({
    where: { sku: String(sku).trim() },
    raw: true,
  });
  return product;
};

/**
 * Alias para compatibilidad con fetchByItemId
 */
exports.fetchByItemId = exports.fetchBySku;

/**
 * Obtiene todos los productos (opcional)
 */
exports.fetchAll = async () => {
  return await Products.findAll({ raw: true });
};

