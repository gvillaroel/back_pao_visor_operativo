const Sequelize = require("sequelize");

class Articulos extends Sequelize.Model {
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
                type: DataTypes.STRING(25),
            },
            descripcion: {
                type: DataTypes.STRING,
            },
            estatus: {
                type: DataTypes.STRING(50),
            },
            categoria: {
                type: DataTypes.STRING,
            },
            tipo_sku: {
                type: DataTypes.STRING(50),
            },
            bandera_categoria: {
                type: DataTypes.STRING(50),
            },
            bandera: {
                type: DataTypes.STRING(50),
            },
            indicador_categoria: {
                type: DataTypes.STRING(50),
            },
            volumen_sku: {
                type: DataTypes.STRING(50),
            },
            caracteristica: {
                type: DataTypes.STRING(50),
            },
            indicador_sku: {
                type: DataTypes.STRING(50),
            },
            proveedor_id: {
                type: DataTypes.STRING,
            },
            /* proveedor_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: "proveedores",
                    key: "proveedor_id",
                },
            }, */
            proveedor_nombre: {
                type: DataTypes.STRING,
            },
            modelo: {
                type: DataTypes.STRING(50),
            },
            valor_envace: {
                type: DataTypes.STRING(50),
            },
            ancho: {
                type: DataTypes.INTEGER,
            },
            seccion: {
                type: DataTypes.INTEGER,
            },
            servicio: {
                type: DataTypes.STRING(50),
            },
            condicion: {
                type: DataTypes.STRING(50),
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
            tableName: "articulos",
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

module.exports = (sequelize, DataTypes) => Articulos.init(sequelize, DataTypes);
