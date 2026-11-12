const Sequelize = require("sequelize");

class BitacoraAccesos extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id_bitacora: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "id_bitacora",
      },
      nombre_accion: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      nombre_modulo: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      usuario: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      ip: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      employeenumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      id_function: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      desc_function: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      area_trabajo: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      idsociety: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      society: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      idphisicalocation: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      phisicallocation: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      so: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      navegador: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      origen: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      create_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    }, {
      sequelize,
      tableName: "bitacora_accesos",
      schema: "cnpao",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id_bitacora" },
          ],
        },
      ],
    });
  }
}

module.exports = (sequelize, DataTypes) => BitacoraAccesos.init(sequelize, DataTypes);
