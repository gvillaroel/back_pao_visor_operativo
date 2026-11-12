const Sequelize = require("sequelize");

class MultiStopTransfers extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                IdMultiSopts: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                ShipmentNo: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                OrderNo: {
                    type: DataTypes.STRING(30),
                    allowNull: false,
                },
                OrderHeaderKey: {
                    type: DataTypes.STRING(30),
                    allowNull: true,
                },
                ShipDate: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                DeliveryDate: {
                    type: DataTypes.STRING(30),
                    allowNull: true,
                },
                OriginNode: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                DestinationNode: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                Stops: {
                    type: Sequelize.JSONB,
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
            },
            {
                sequelize,
                tableName: "multi_stop_transfers",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => MultiStopTransfers.init(sequelize, DataTypes);
