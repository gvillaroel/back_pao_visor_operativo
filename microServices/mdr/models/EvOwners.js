const Sequelize = require('sequelize');

class EvOwners extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        ownerLabel: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        fullName: {
          type: DataTypes.STRING(100),
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
      },
      {
        sequelize,
        tableName: 'ev_owners',
        schema: 'cnpao',
        timestamps: false,
        indexes: [
          {
            name: 'ev_owners_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
module.exports = (sequelize, DataTypes) => EvOwners.init(sequelize, DataTypes);
