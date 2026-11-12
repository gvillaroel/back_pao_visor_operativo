const Sequelize = require("sequelize");

class Inventario extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            inventario_id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            material_id: {
                type: DataTypes.INTEGER,
            },
            proveedor_id: {
                type: DataTypes.INTEGER,
            },
            congelado: {
                type: DataTypes.BOOLEAN,
            },
            articulo: {
                type: DataTypes.INTEGER,
            },
            buena_condicion: {
                type: DataTypes.BOOLEAN,
            },
            disponible: {
                type: DataTypes.INTEGER,
            },
            ventas: {
                type: DataTypes.INTEGER,
            },
            transferencias: {
                type: DataTypes.INTEGER,
            },
            apartados: {
                type: DataTypes.INTEGER,
            },
            filas: {
                type: DataTypes.INTEGER,
            },
            pendiente_proveedor: {
                type: DataTypes.INTEGER,
            },
            estado: {
                type: DataTypes.STRING(50),
            },
            condicion: {
                type: DataTypes.STRING(50),
            },
            create_time: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            update_time: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        }, {
            sequelize,
            tableName: "inventarios",
            timestamps: false,
            schema: "cnpao",
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "inventario_id" },
                    ],
                },
            ],
        });
    }
}

module.exports = (sequelize, DataTypes) => Inventario.init(sequelize, DataTypes);
