const Sequelize = require('sequelize');

class EvAdress extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        fullName: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        street: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        exteriorNumber: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        zipCode: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        neighbourhood: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        delegationOrMunicipality: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        city: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        mdr_eventId: {
          type: DataTypes.STRING(30),
          allowNull: true,
          references: {
            model: 'mdr',
            key: 'eventId',
          },
        },
        fcreacion: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        factualizacion: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'ev_adress',
        schema: 'cnpao',
        timestamps: false,
        indexes: [
          {
            name: 'ev_adress_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
module.exports = (sequelize, DataTypes) => EvAdress.init(sequelize, DataTypes);
