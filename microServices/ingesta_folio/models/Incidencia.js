const Sequelize = require('sequelize');

class Incidencia extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        Id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: true,
          primaryKey: true,
        },
        Sku: {
          type: DataTypes.CHAR(50),
          allowNull: false,
        },
        Title: {
          type: DataTypes.CHAR(255),
          allowNull: true,
        },
        Category: {
          type: DataTypes.CHAR(100),
          allowNull: true,
        },
        Resolutor: {
            type: DataTypes.CHAR(100),
            allowNull: true,
        },
        Description: {
            type: DataTypes.CHAR(255),  
            allowNull: true,
        },
        Solicitante: {
            type: DataTypes.CHAR(100),
            allowNull: true,
        },
        SubCategory: {
            type: DataTypes.CHAR(100),
            allowNull: true,
        },
        WorkOrderID: {
            type: DataTypes.CHAR(50),
            allowNull: false,
        },
        FechaDeStatus: {
            type: DataTypes.CHAR(50),
            allowNull: true,
        },
        WorkOrderLink: {
            type: DataTypes.CHAR(255),
            allowNull: false,
        },
        CorreoResolutor: {
            type: DataTypes.CHAR(255),
            allowNull: true,
        },
        CreatedDateTime: {
            type: DataTypes.CHAR(50),
            allowNull: false,
        },
        EquipoResolutor: {
            type: DataTypes.CHAR(50),
            allowNull: true,
        },
        WorkOrderStatus: {
            type: DataTypes.CHAR(50),
            allowNull: true,
        },
        CloseDescription: {
            type: DataTypes.CHAR(255),
            allowNull: true,
        },
        CorreoSolicitante: {
            type: DataTypes.CHAR(255),
            allowNull: true,
        },
        LocacionResolutor: {
            type: DataTypes.CHAR(50),
            allowNull: true,
        },
        ExpectedCompletionDate: {
            type: DataTypes.CHAR(50),
            allowNull: true,
        },
        DescripcionLocacionResolutor: {
            type: DataTypes.CHAR(255),
            allowNull: true,
        },
        OrderLineKey: {
            type: DataTypes.NUMERIC,
            allowNull: false,
            references: {
                model: "linea",
                key: "OrderLineKey",
            },
        },
        FchCreacion: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        FchActualizacion: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'incidencias',
        schema: 'cnpao',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}

module.exports = (sequelize, DataTypes) =>
    Incidencia.init(sequelize, DataTypes);