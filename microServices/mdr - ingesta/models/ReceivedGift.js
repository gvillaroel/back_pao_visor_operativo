const Sequelize = require('sequelize');

class ReceivedGift extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        remissionType: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        sku: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        price: {
          type: DataTypes.STRING(20),
          allowNull: true,
          get() {
            const value = this.getDataValue('price');
            return value === null ? null : parseFloat(value);
          },
        },
        quantity: {
          type: DataTypes.STRING(20),
          allowNull: true,
          get() {
            const value = this.getDataValue('quantity');
            return value === null ? null : parseInt(value, 10);
          },
        },
        deliveryMode: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        orderNumber: {
          type: DataTypes.STRING(30),
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
        tableName: 'received_gift',
        schema: 'cnpao',
        timestamps: false,
        indexes: [
          {
            name: 'received_gift_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}

module.exports = (sequelize, DataTypes) =>
  ReceivedGift.init(sequelize, DataTypes);
