const Sequelize = require("sequelize");

class orden_venta_vw extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        OrderHeaderKey: {
          type: DataTypes.STRING(30),
          allowNull: false,
          primaryKey: true,
        },
        OrderNo: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "orden_venta_vw",
        schema: "cnpao",
        timestamps: false,
      },
    );
  }
}

module.exports = (sequelize, DataTypes) => orden_venta_vw.init(sequelize, DataTypes);
