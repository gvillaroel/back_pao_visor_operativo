const Sequelize = require("sequelize");

class TokenUrlMagic extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        field: "id_token",
      },
      correo: {
        type: DataTypes.CHAR(250),
        allowNull: false,
      },
      token: {
        type: DataTypes.CHAR(3000),
        allowNull: false,
      },
      activo: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    }, {
      sequelize,
      tableName: "token_urlmagic",
      schema: "omsrback",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id_token" },
          ],
        },
      ],
    });
  }
}

module.exports = (sequelize, DataTypes) => TokenUrlMagic.init(sequelize, DataTypes);
