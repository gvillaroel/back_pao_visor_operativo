const Sequelize = require("sequelize");

class Centros extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                field: "id",
            },
            numero: {
                type: DataTypes.STRING,
            },
            nombre: {
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
            tableName: "centros",
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

module.exports = (sequelize, DataTypes) => Centros.init(sequelize, DataTypes);
