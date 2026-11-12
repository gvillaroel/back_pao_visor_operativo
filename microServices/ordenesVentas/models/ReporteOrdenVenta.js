const Sequelize = require('sequelize');

class ReporteOrdenVenta extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        Empresa: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        OrderNo: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        OrderDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        ItemID: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        StatusLine: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        LineType: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        pause: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        Inventario_futuro: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        inventario_futuro_so: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        ReqDeliveryDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        ReqDeliveryDate2: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        ExtnCustomerDeliveryDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        TO: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        'OrderDate TO': {
          type: DataTypes.DATE,
          allowNull: true,
        },
        'item TO': {
          type: DataTypes.STRING,
          allowNull: true,
        },
        'status line TO': {
          type: DataTypes.STRING,
          allowNull: true,
        },
        'pause TO': {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        'FirstShipDate TO': {
          type: DataTypes.DATE,
          allowNull: true,
        },
        inventario_futuro_TO: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        'ReqDeliveryDate TO': {
          type: DataTypes.DATE,
          allowNull: true,
        },
        'ReqDeliveryDate2 TO': {
          type: DataTypes.DATE,
          allowNull: true,
        },
        'ExtnCustomerDeliveryDate TO': {
          type: DataTypes.DATE,
          allowNull: true,
        },
        'nuemro envio TO': {
          type: DataTypes.STRING,
          allowNull: true,
        },
        'Status shipment TO': {
          type: DataTypes.STRING,
          allowNull: true,
        },
        'ExpectedDeliveryDate TO': {
          type: DataTypes.DATE,
          allowNull: true,
        },
        'ExpectedShipmentDate TO': {
          type: DataTypes.DATE,
          allowNull: true,
        },
        ShipNode_TO: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        ShipNode: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        OrderedQty: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
        ContainerNo: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        ExtnGREventID: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        TrackingNo: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        ExtnDesignCenterID: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        EMailID: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        EMailIDNuevo: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        DayPhone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        DayPhoneNuevo: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        PrimeLineNo: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'reporte_orden_venta',
        schema: 'cnpao',
        timestamps: false,
        primaryKey: false,
      }
    );
  }
}

module.exports = (sequelize, DataTypes) =>
  ReporteOrdenVenta.init(sequelize, DataTypes);
