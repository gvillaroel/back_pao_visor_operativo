const Sequelize = require("sequelize");

class PedidosExternos extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                field: "id",
            },
            nacional: {
                type: DataTypes.INTEGER,
            },
            importacion: {
                type: DataTypes.INTEGER,
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
            tableName: "pedidos_externos",
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

module.exports = (sequelize, DataTypes) => PedidosExternos.init(sequelize, DataTypes);
