const Sequelize = require("sequelize");

class errores extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id_error: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: "id_error",
      },
      json_body: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      error: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      create_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    }, {
        sequelize,
        tableName: "errores",
        schema: "cnpao",
        timestamps: false,
      },);
  }
}

module.exports = (sequelize, DataTypes) => errores.init(sequelize, DataTypes);
