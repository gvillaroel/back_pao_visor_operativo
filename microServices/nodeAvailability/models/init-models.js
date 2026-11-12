const { DataTypes } = require("sequelize");
const _Products = require("./Products");
const _InventoryNode = require("./InventoryNode");
const _ProductInventory = require("./ProductInventory");

function initModels(sequelize) {
  const Products = _Products(sequelize, DataTypes);
  const InventoryNode = _InventoryNode(sequelize, DataTypes);
  const ProductInventory = _ProductInventory(sequelize, DataTypes);

  // Relaciones
  Products.hasMany(ProductInventory, { foreignKey: "id_product" });
  ProductInventory.belongsTo(Products, { foreignKey: "id_product" });

  InventoryNode.hasMany(ProductInventory, { foreignKey: "id_node" });
  ProductInventory.belongsTo(InventoryNode, { foreignKey: "id_node" });

  return {
    Products,
    InventoryNode,
    ProductInventory,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
