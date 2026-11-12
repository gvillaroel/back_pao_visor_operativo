const Sequelize = require("sequelize");

class PedidosNacionales extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                field: "id",
            },
            sku: {
                type: DataTypes.INTEGER,
                references: {
                    model: "articulos",
                    key: "id",
                },
            },
            location: {
                type: DataTypes.STRING,
            },
            descripcion_sku: {
                type: DataTypes,
            },
            centro: {
                type: DataTypes.INTEGER,
            },
            numero_pedido: {
                type: DataTypes.STRING,
            },
            cantidad_pendiente: {
                type: DataTypes.STRING,
            },
            inicio_validez: {
                type: DataTypes.STRING,
            },
            fin_validez: {
                type: DataTypes.STRING,
            },
            fecha_cita: {
                type: DataTypes.STRING,
            },
            dump1: { // dump1
                type: DataTypes.STRING,
            },
            dump2: { // Num proveedor
                type: DataTypes.STRING,
            },
            dump3: { // estado pedido
                type: DataTypes.STRING,
            },
            dump4: { // descripcion_estado_pedido
                type: DataTypes.STRING,
            },
            dump5: { // cantidad_pedido
                type: DataTypes.STRING,
            },
            cantidad_pedido: {
                type: DataTypes.STRING,
            },
            dump6: {
                type: DataTypes.STRING,
            },
            dump7: {
                type: DataTypes.STRING,
            },

            cantidad_cita: {
                type: DataTypes.STRING,
            },
            filler: {
                type: DataTypes.STRING,
            },
            dump8: {
                type: DataTypes.STRING,
            },
            proveedor: {
                type: DataTypes.STRING,
            },
            no_proveedor: {
                type: DataTypes.STRING,
            },
            comprador: {
                type: DataTypes.STRING,
            },
            create_time: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            update_time: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        }, {
            sequelize,
            tableName: "pedidos_nacionales",
            schema: "cnpao",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "id" },
                    ],
                },
            ],
        });
    }
}

module.exports = (sequelize, DataTypes) => PedidosNacionales.init(sequelize, DataTypes);
