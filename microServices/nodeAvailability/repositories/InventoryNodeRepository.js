const db = require("../config/db");
const initModels = require("../models/init-models");

const { InventoryNode } = initModels(db.sequelize);

/**
 * Busca un nodo de inventario en BD por su código de nodo (shipNode)
 * @param {string} nodeCode Código del nodo
 * @returns {Promise<Object|null>} Registro del nodo o null
 */
exports.fetchByNodeCode = async (nodeCode) => {
  if (!nodeCode) return null;
  const node = await InventoryNode.findOne({
    where: { node_code: String(nodeCode).trim() },
    raw: true,
  });
  return node;
};

/**
 * Obtiene todos los nodos de inventario activos
 */
exports.fetchAllActive = async () => {
  return await InventoryNode.findAll({
    where: { is_active: true },
    raw: true,
  });
};

