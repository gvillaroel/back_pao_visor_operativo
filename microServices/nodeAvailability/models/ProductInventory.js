const Sequelize = require("sequelize");

class ProductInventory extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    const schema = process.env.DB_SCHEMA || "cnpao";
    return super.init(
      {
        id_inventory: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        id_product: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "products",
            key: "id_product",
          },
        },
        id_node: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "inventory_node",
            key: "id_node",
          },
        },
        available_quantity: {
          type: DataTypes.DECIMAL,
          defaultValue: 0,
          allowNull: true,
        },
        to_ts: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "product_inventory",
        schema: schema,
        timestamps: false,
      }
    );
  }
}

module.exports = (sequelize, DataTypes) => ProductInventory.init(sequelize, DataTypes);
