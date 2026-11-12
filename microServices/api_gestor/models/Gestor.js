const Sequelize = require("sequelize");

class Hanna extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        guia: {
          type: DataTypes.CHAR(30),
          allowNull: false,
          primaryKey: true,
        },
        pl3: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "pl3",
        },
        pl3ID: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          field: "pl3ID",
        },
        repartidor: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          field: "repartidor",
        },
        cp: {
          type: DataTypes.CHAR(100),
          allowNull: false,
          field: "cp",
        },
        remision: {
          type: DataTypes.CHAR(100),
          allowNull: false,
          field: "remision",
        },
        referencia: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          field: "referencia",
        },
        lp: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          field: "lp",
        },
        estatus3PL: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "estatus_3PL",
        },
        estatus4PL: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "estatus_4PL",
        },
        centro: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "centro",
        },
        centroNombre: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "centroNombre",
        },
        destinatarioGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "destinatario",
        },
        correoGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "correo",
        },
        telefonoGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "telefono",
        },
        calleGestor: {
          type: DataTypes.CHAR(30),
          allowNull: false,
          field: "calle",
        },
        numExteriorGestor: {
          type: DataTypes.CHAR(30),
          allowNull: false,
          field: "num_exterior",
        },
        numInteriorGestor: {
          type: DataTypes.CHAR(30),
          allowNull: false,
          field: "num_interior",
        },
        entreCallesGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "entre_calles",
        },
        asentamientoGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "asentamiento",
        },
        municipioGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "municipio",
        },
        ciudadGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "ciudad",
        },
        estadoGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "estado",
        },
        paisGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "pais",
        },
        personaQueRecibeGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "persona_Que_Recibe",
        },
        parentescoGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "parentesco",
        },
        firmaRecibidoGestor: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "firma_Recibido",
        },
        evidenciaVisita: {
          type: DataTypes.CHAR(100),
          allowNull: false,
          field: "evidencia_Visita",
        },
        estatusLiv: {
          type: DataTypes.CHAR(100),
          allowNull: false,
          field: "estatus_Liv",
        },
        fechaHoraGreaGuia: {
          type: DataTypes.CHAR(100),
          allowNull: false,
          field: "fecha_Hora_GreaGuia",
        },
        fechaHoraEStatus: {
          type: DataTypes.CHAR(100),
          allowNull: false,
          field: "fecha_Hora_EStatus",
        },
        motivo: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "motivo",
        },
        usuario4pl: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "usuario_4pl",
        },
        usuario3pl: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "usuario_3pl",
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
      },
      {
        sequelize,
        tableName: "gestor",
        schema: "cnpao",
        timestamps: false,
        indexes: [
          {
            name: "guia_pkey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "guia" }],
          },
        ],
      },
    );
  }
}

module.exports = (sequelize, DataTypes) => Hanna.init(sequelize, DataTypes);
