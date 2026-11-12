const Sequelize = require("sequelize");

class linea extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                OrderLineKey: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    primaryKey: true,
                },
                FirstShipDate: {
                    type: DataTypes.STRING(30),
                    allowNull: true,
                },
                ExtnHipotecaVerde: {
                    type: DataTypes.STRING(30),
                    allowNull: true,
                },
                OrderHeaderKey: {
                    type: DataTypes.STRING(30),
                    allowNull: true,
                },
                ItemID: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                },
                "Cancelacion3+3": {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                },
                DeliveryMethod: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                OrderedQty: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                OriginalOrderedQty: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                StatusQuantity: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                ChangeInOrderedQty: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                BackOrderedQuantity: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                ShipNode: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                PrimeLineNo: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                ReceivingNode: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                StoreDesc: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                StatusLinePrevio: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                StatusLine: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                ExtnIsExpedited: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                OrderLineStatus: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                IsCancellable: {
                    type: DataTypes.STRING(1),
                    allowNull: true,
                },
                LineType: {
                    type: DataTypes.STRING(40),
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
                SubLineNo: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                EDDHasChanged: {
                    type: DataTypes.STRING(1),
                    allowNull: true,
                },
                ExpectedDeliveryDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                ExtnDeliveryType: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                ExtnNoSpotService: {
                    type: DataTypes.STRING(1),
                    allowNull: true,
                },
                ExtnIsFreeLine: {
                    type: DataTypes.STRING(1),
                    allowNull: true,
                },
                ExtnCustomerDeliveryDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                ActualQuantity: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                NetWeight: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                NetWeightUom: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                OrderReleaseKey: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                OverShipQuantity: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                QuantityReduced: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                ReleaseNo: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                Segment: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                SegmentType: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                ShipmentLineKey: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                ShipmentLineNo: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                StoreShipmentType: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                isHistory: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                MaxLineStatus: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                MaxLineStatusDesc: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                MinLineStatus: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                MinLineStatusDesc: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                IntentoRecogido: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                FchCreacion: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                FchActualizacion: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                CarrierServiceCode: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                ShipNode_CarrierServiceCode: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                WorkOrderID: {
                    type: DataTypes.STRING(30),
                    allowNull: true,
                },
                WorkOrderLink: {
                    type: DataTypes.STRING(500),
                    allowNull: true,
                },
                ExtnReturnPickupDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                ExtnPauseForRDDADD: {
                    type: DataTypes.STRING(1),
                    allowNull: true,
                },
                DerivedPrimeLineNo: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                ReqDeliveryDateDesc: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                isReship: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                },
                ReshipParentLineKey: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "linea",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => linea.init(sequelize, DataTypes);
