const Sequelize = require("sequelize");

class Hanna extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id_hanna: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          field: "id_hanna",
        },
        remision: {
          type: DataTypes.CHAR(15),
          allowNull: false,
        },
        fechaCompra: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "fechacompra",
        },
        fechaSolDev: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "fechasoldev",
        },
        fechaDevApl: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "fechadevapl",
        },
        usrAsesorSap: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "usrasesorsap",
        },
        usrAdmonSap: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "usradmonsap",
        },
        tiendaOrigen: {
          type: DataTypes.CHAR(100),
          allowNull: false,
          field: "tiendaorigen",
        },
        role_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
        tiendaRecon: {
          type: DataTypes.CHAR(100),
          allowNull: false,
          field: "tiendarecon",
        },
        evento: {
          type: DataTypes.CHAR(50),
          allowNull: false,
        },
        sku: {
          type: DataTypes.CHAR(50),
          allowNull: false,
        },
        piezas: {
          type: DataTypes.CHAR(50),
          allowNull: false,
        },
        precioUnit: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          field: "preciounit",
        },
        descuento: {
          type: DataTypes.CHAR(20),
          allowNull: false,
        },
        totalCobro: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          field: "totalcobro",
        },
        estatus: {
          type: DataTypes.CHAR(50),
          allowNull: false,
        },
        recogido: {
          type: DataTypes.CHAR(50),
          allowNull: false,
        },
        descEstatus: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "descestatus",
        },
        descMotivo: {
          type: DataTypes.CHAR(100),
          allowNull: false,
          field: "descmotivo",
        },
        comentarios: {
          type: DataTypes.CHAR(100),
          allowNull: false,
        },
        boletaDev: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          field: "boletadev",
        },
        idDevPaypal: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          field: "iddevpaypal",
        },
        idVtaPaypal: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          field: "idvtapaypal",
        },
        descCausa: {
          type: DataTypes.CHAR(100),
          allowNull: false,
          field: "desccausa",
        },
        descDCausa: {
          type: DataTypes.CHAR(100),
          allowNull: false,
          field: "descdcausa",
        },
        descTipoDev: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "desctipodev",
        },
        entEfecTda: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "entefectda",
        },
        refOpenPay: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "refopenpay",
        },
        carrComp: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "carrcomp",
        },
        bonMerc: {
          type: DataTypes.CHAR(50),
          allowNull: false,
          field: "bonmerc",
        },
        promBonif: {
          type: DataTypes.CHAR(20),
          allowNull: false,
          field: "prombonif",
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
        tableName: "hanna",
        schema: "cnpao",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id_hanna" }],
          },
        ],
      }
    );
  }
}

module.exports = (sequelize, DataTypes) => Hanna.init(sequelize, DataTypes);
