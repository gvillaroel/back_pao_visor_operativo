const Sequelize = require("sequelize");

class HistoricoComentarios extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        id_comentario: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        responsable: {
          type: DataTypes.CHAR(50),
          allowNull: false,
        },
        valor_anterior: {
          type: DataTypes.TEXT(50),
          allowNull: true,
        },
        valor_posterior: {
          type: DataTypes.TEXT(50),
          allowNull: false,
        },
        fecha_creacion: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        orden: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        executed: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "historico_comentarios",
        schema: "cnpao",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "historico_comentarios_orden_idx",
            fields: ["orden"],
            using: "BTREE",
          },
        ],
      },
    );
  }
}

module.exports = (sequelize, DataTypes) => HistoricoComentarios.init(sequelize, DataTypes);
