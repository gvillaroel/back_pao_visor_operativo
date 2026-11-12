const Sequelize = require("sequelize");

class TOOrder extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                ID_TOOrder: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                OrderLineKey: {
                    type: DataTypes.DECIMAL,
                    allowNull: false,
                    primaryKey: true,
                },
                OrderHeaderKey: {
                    type: DataTypes.STRING(30),
                    allowNull: true,
                },
                ItemID: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                },
                OrderNo: {
                    type: DataTypes.STRING(30),
                    allowNull: true,
                },
                Status: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                Quantity: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                ShipNode: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                ShipmentNo: {
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
            },
            {
                sequelize,
                tableName: "TOOrder",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => TOOrder.init(sequelize, DataTypes);
