const Sequelize = require("sequelize");

class OrdenComentarios extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id_comentario: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        orden: {
          type: DataTypes.CHAR(50),
          allowNull: false,
        },
        comentario: {
          type: DataTypes.TEXT(50),
          allowNull: false,
        },
        responsable: {
          type: DataTypes.CHAR(50),
          allowNull: false,
        },
        fecha_creacion: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        sequelize,
        tableName: "orden_comentarios",
        schema: "cnpao",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id_comentario" }],
          },
          {
            name: "idx_fecha_creacion",
            fields: ["fecha_creacion"],
            using: "BTREE",
          },
          {
            name: "idx_numero_orden",
            fields: ["orden"],
            using: "BTREE",
          },
          {
            name: "orden_comentarios_orden_idx",
            fields: ["orden", "responsable", "fecha_creacion", "id_comentario"],
            using: "BTREE",
          },
        ],
      },
    );
  }
}

module.exports = (sequelize, DataTypes) => OrdenComentarios.init(sequelize, DataTypes);
