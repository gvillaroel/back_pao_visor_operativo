const Sequelize = require("sequelize");

class orden_venta extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        "OrderHeaderKey": {
          type: DataTypes.STRING(30),
          allowNull: false,
          primaryKey: true
        },
        "OrderNo": {
          type: DataTypes.STRING(30),
          allowNull: false
        },
        "CustomerEMailID": {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        "EnterpriseCode": {
          type: DataTypes.STRING(24),
          allowNull: false
        },
        "SellerOrganizationCode": {
          type: DataTypes.STRING(24),
          allowNull: false
        },
        "MessageType": {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        "StatusTimeStamp": {
          type: DataTypes.DATE,
          allowNull: true,
        },
        "OrderStatusPrevio": {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        "OrderStatus": {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        "CarrierServiceCode": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "CancelledBy": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ChainType": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "SalesOrderNo": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "OrderType": {
          type: DataTypes.STRING(10),
          allowNull: true
        },
        "EntryType": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "TotalAmount": {
          type: DataTypes.DECIMAL,
          allowNull: true
        },
        "IDCliente": {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        "DocumentType": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "MaxOrderStatus": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "MaxOrderStatusDesc": {
          type: DataTypes.STRING(50),
          allowNull: true
        },
        "MinOrderStatus": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "MinOrderStatusDesc": {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        "OrderDate": {
          type: DataTypes.DATE,
          allowNull: true,
        },
        "OrderName": {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        "OrderStatus": {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        "ExtnIsGiftPlusPurchase": {
          type: DataTypes.STRING(1),
          allowNull: true
        },
        "ExtnIsSelfAllocatedFromPOS": {
          type: DataTypes.STRING(1),
          allowNull: true
        },
        "ExtnOrderType": {
          type: DataTypes.STRING(50),
          allowNull: true
        },
        "ExtnPaymentType": {
          type: DataTypes.STRING(50),
          allowNull: true
        },
        "ExtnRegion": {
          type: DataTypes.STRING(50),
          allowNull: true
        },
        "DepartmentCode": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "FulfillmentType": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "HasChainedLines": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ExtnGRDeliveryDays": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ExtnGREventID": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ExtnGREventName": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ExtnGROwnerName": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ExtnPushEmailID": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ExtnEnterpriseCode": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ExtnEmployeeNumber": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ExtnTicketNumber": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ExtnStoreSalesCredit": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ExtnStoreNumber": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "BillToID": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "ExtnNoCancel": {
          type: DataTypes.STRING(40),
          allowNull: true
        },
        "FchCreacion": {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        "FchActualizacion": {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        tableName: "orden_venta",
        schema: "cnpao",
        timestamps: false,
      },
    );
  }
}

module.exports = (sequelize, DataTypes) => orden_venta.init(sequelize, DataTypes);
