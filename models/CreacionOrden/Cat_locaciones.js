const Sequelize = require("sequelize");

class cat_locaciones extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                LocacionVentaNum: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                },
                Empresa: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                Zona: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                TipoLocacion: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                Surtidora: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                ModeloCita: {
                    type: DataTypes.STRING(300),
                    allowNull: true,
                },
                "FchCreacion": {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                "FchActualizacion": {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "cat_locaciones",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => cat_locaciones.init(sequelize, DataTypes);
