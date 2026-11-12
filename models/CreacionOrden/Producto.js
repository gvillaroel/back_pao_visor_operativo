const Sequelize = require("sequelize");

class producto extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                "id_producto": {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true
                },
                "ItemID": {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                },
                "ProductClass": {
                    type: DataTypes.STRING(10),
                    allowNull: true
                },
                "SupplierItem": {
                    type: DataTypes.STRING(40),
                    allowNull: true
                },
                "UnitPrice": {
                    type: DataTypes.DECIMAL,
                    allowNull: true
                },
                "Quantity": { //No esta en Product esta en line o shipment
                    type: DataTypes.DECIMAL,
                    allowNull: true
                },
                "SKU": { //No existe
                    type: DataTypes.STRING(50),
                    allowNull: true
                },
                "skuAmount": { //No existe
                    type: DataTypes.STRING(100),
                    allowNull: true
                },
                "Seller": { //no existe
                    type: DataTypes.STRING(100),
                    allowNull: true
                },
                "OrderLineKey": {
                    type: DataTypes.DECIMAL,
                    allowNull: true
                },
                "ItemDesc": {
                    type: DataTypes.STRING(200),
                    allowNull: true
                },
                "ExtnIsReturnPickup": {
                    type: DataTypes.STRING(10),
                    allowNull: true
                },
                "ExtnSpecialItem": {
                    type: DataTypes.STRING(10),
                    allowNull: true
                },
                "UnitOfMeasure": {
                    type: DataTypes.STRING(40),
                    allowNull: true
                },
                "ImageURL": {
                    type: DataTypes.STRING(200),
                    allowNull: true
                },
                "ItemType": {
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
                tableName: "producto",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => producto.init(sequelize, DataTypes);
