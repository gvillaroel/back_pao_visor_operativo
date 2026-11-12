const Sequelize = require("sequelize");

class Products extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    const schema = process.env.DB_SCHEMA || "cnpao";
    return super.init(
      {
        id_product: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        sku: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(100),
          allowNull: false,
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
        tableName: "products",
        schema: schema,
        timestamps: false,
      }
    );
  }
}

module.exports = (sequelize, DataTypes) => Products.init(sequelize, DataTypes);

