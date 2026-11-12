const Sequelize = require("sequelize");

class cat_estatus_notificacion extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id_estatus_notificacion: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                desc_estatus: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                FchCreacion: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                FchActualizacion: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },

            },
            {
                sequelize,
                tableName: "cat_estatus_notificacion",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => cat_estatus_notificacion.init(sequelize, DataTypes);
