const Sequelize = require("sequelize");

class InventoryNode extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    const schema = process.env.DB_SCHEMA || "cnpao";
    return super.init(
      {
        id_node: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        node_code: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        node_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        node_type: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
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
        tableName: "inventory_node",
        schema: schema,
        timestamps: false,
      }
    );
  }
}

module.exports = (sequelize, DataTypes) => InventoryNode.init(sequelize, DataTypes);

