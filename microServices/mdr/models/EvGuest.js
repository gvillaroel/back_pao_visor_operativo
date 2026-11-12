const Sequelize = require('sequelize');

class EvGuest extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        guestName: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(40),
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
        },
        factualizacion: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'ev_guest',
        schema: 'cnpao',
        timestamps: false,
        indexes: [
          {
            name: 'ev_guest_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
module.exports = (sequelize, DataTypes) => EvGuest.init(sequelize, DataTypes);
