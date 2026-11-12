const Sequelize = require("sequelize");

class Cxcec extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        store:DataTypes.JSON,
        order: DataTypes.JSON,
        sku: DataTypes.JSON,
        create_time: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        update_time: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "cxcec",
        schema: "cnpao",
        timestamps: false,
        indexes: [
          {
            name: "cxcec_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}
module.exports = (sequelize, DataTypes) => {
  const model = Cxcec.init(sequelize, DataTypes);
  return model;
};
