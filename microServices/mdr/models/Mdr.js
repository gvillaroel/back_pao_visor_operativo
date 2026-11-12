const Sequelize = require('sequelize');

class Mdr extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        eventId: {
          type: DataTypes.STRING(30),
          allowNull: false,
          primaryKey: true,
        },
        eventStatus: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        creationStore: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        expirationDate: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        preferredDeliveryDays: {
          type: DataTypes.STRING(100),
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
      },
      {
        sequelize,
        tableName: 'mdr',
        schema: 'cnpao',
        timestamps: false,
        indexes: [
          {
            name: 'mdr_pkey',
            unique: true,
            fields: [{ name: 'eventId' }],
          },
        ],
      }
    );
  }
}

module.exports = (sequelize, DataTypes) => Mdr.init(sequelize, DataTypes);
