const Sequelize = require("sequelize");

class Proveedores extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id_proveedor: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "id_proveedor",
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      numero_proveedor: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      tipo: {
        type: DataTypes.STRING(50),
      },
      create_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      update_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        defaultValue: 1,
      },
    }, {
      sequelize,
      tableName: "proveedores",
      schema: "cnpao",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "proveedor_id" },
          ],
        },
      ],
    });
  }
}

module.exports = (sequelize, DataTypes) => Proveedores.init(sequelize, DataTypes);
