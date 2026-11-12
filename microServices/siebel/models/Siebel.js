const Sequelize = require('sequelize');

class Siebel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        strDirContacto: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        strNombreContacto: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        strFecApertura: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strUltimaModificacion: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strActualizadoPor: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strResumen: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        strTipoLlamada: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strFecCierre: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        strFecCompromiso: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strCreadoPor: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strDetalle: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        strCategoria: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strArea: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strSubcategoria: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strEdoGarantia: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strModelo: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strProveedor: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strMarca: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        strMotivoCancelacion: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        strMotivoCierre: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        strTelContacto: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strEmailContacto: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strGrupo: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strSKU: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strDescripcionSKU: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        strOrdenVenta: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strSolucion: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        strFechaSol: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        strMotivoSolucion: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        strSubMotivoSolucion: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        strMedioContacto: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strSubEdo: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strTicketCompra: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strTipoCategoria: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strPropietario: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strPrioridad: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strFecCompra: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strAlmacenCompra: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strIdSS: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strNoSS: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        strNumSerie: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        strFecEntrega: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strStatusSS: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        fcreacion: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        factualizacion: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        create_time: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        update_time: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'siebel',
        schema: 'cnpao',
        timestamps: false,
        indexes: [
          {
            name: 'siebel_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}

module.exports = (sequelize, DataTypes) => Siebel.init(sequelize, DataTypes);
