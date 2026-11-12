const Sequelize = require('sequelize');

class Integraciones extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        IDIntegracion: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        Sistema: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        JSONSistema: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        OrderHeaderKey: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        MessageType: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        EstatusEjecucion: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        FchCreacion: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        FchActualizacion: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        error: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'integraciones',
        schema: 'cnpao',
        timestamps: false,
        indexes: [
          {
            name: 'integraciones_pkey',
            unique: true,
            fields: [{ name: 'IDIntegracion' }],
          },
        ],
      }
    );
  }
}

module.exports = (sequelize, DataTypes) =>
  Integraciones.init(sequelize, DataTypes);
