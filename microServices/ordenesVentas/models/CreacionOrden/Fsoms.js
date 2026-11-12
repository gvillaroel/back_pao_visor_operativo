const Sequelize = require("sequelize");

class fsoms extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                orden: {
                    type: DataTypes.STRING(30),
                    allowNull: false,
                },
                sku: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                fecha_soms: {
                    type: DataTypes.DATEONLY,
                    allowNull: true,
                },
                npedido: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                fecha_creacion: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                fecha_actualizacion: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                creado_por: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                modificado_por: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                activo: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                tableName: "fsoms",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => fsoms.init(sequelize, DataTypes);
