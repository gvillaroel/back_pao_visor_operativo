const Sequelize = require("sequelize");

class envio extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                IDEnvio: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                ShipmentKey: {
                    type: DataTypes.STRING(30),
                    // primaryKey: true,
                    allowNull: true,
                },
                ShipmentNo: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                ShipmentQuantity: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                OrderLineKey: {
                    type: DataTypes.DECIMAL,
                    primaryKey: true,
                },
                RequestedCarrierServiceCode: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                RequestedDeliveryDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                RequestedShipmentDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                ExpectedDeliveryDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                ExpectedShipmentDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                SCAC: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                ShipDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                ShipNode: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                Description: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                NodeType: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                StatusShipment: { // POR VALIDAR
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                StatusDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                TotalWeight: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                TotalWeightUOM: {
                    type: DataTypes.STRING(35),
                    allowNull: true,
                },
                UseGestor: {
                    type: DataTypes.STRING(1),
                    allowNull: true,
                },
                ContainerNo: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                TrackingNo: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                StatusPrevio: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                Status: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                StatusDescriptionPrevio: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                StatusDescription: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                IntentoEntrega: {
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
                MaxShipmentStatusDesc: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                MinShipmentStatusDesc: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "envio",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => envio.init(sequelize, DataTypes);
