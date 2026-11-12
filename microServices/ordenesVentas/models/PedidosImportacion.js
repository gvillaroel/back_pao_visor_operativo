const Sequelize = require("sequelize");

class PedidosImportacion extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                field: "id",
            },
            articulo: {
                type: DataTypes.INTEGER,
            },
            centro: {
                type: DataTypes.INTEGER,
            },
            cantidad_real_aprovisionamiento: {
                type: DataTypes.STRING(50),
            },
            fecha_estimada_arrivo: {
                type: DataTypes.STRING,
            },
            fecha_fin_estimada_arrivo_cdt: {
                type: DataTypes.STRING,
            },
            zzfecct: {
                type: DataTypes.INTEGER,
            },
            zzcant: {
                type: DataTypes.INTEGER,
            },
            fecha_embarque: {
                type: DataTypes.STRING,
            },
            documento_parcial: {
                type: DataTypes.STRING(50),
            },
            vacio: {
                type: DataTypes.STRING,
            },
            proveedor: {
                type: DataTypes.STRING,
            },
            no_proveedor: {
                type: DataTypes.STRING,
            },
            estado_pedido: {
                type: DataTypes.STRING,
            },
            descripcion_estado_pedido: {
                type: DataTypes.STRING,
            },
            dump1: { // pedido
                type: DataTypes.STRING,
            },
            dump2: { // cantidad_real_aprovisionamiento
                type: DataTypes.STRING,
            },
            dump3: { // proveedor
                type: DataTypes.STRING,
            },
            dump4: { // no_proveedor
                type: DataTypes.STRING,
            },
            dump5: { // estado_pedido
                type: DataTypes.STRING,
            },
            dump6: { // descripcion_estado_pedido
                type: DataTypes.STRING,
            },
            comprador: {
                type: DataTypes.STRING,
            },
            // ** Add
            cantidad_pedido: {
                type: DataTypes.STRING,
            },
            fecha_inicio_vigencia_pedido: {
                type: DataTypes.DATE,
            },
            fecha_fin_vigencia_pedido: {
                type: DataTypes.DATE,
            },
            cantidad_piezas_citadas: {
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
            tableName: "pedidos_importacion",
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

module.exports = (sequelize, DataTypes) => PedidosImportacion.init(sequelize, DataTypes);
