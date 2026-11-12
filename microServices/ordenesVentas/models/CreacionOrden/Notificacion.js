const Sequelize = require("sequelize");

class notificacion extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id_notificacion: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                fch_notificacion: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                medio_notificacion: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                correo_notificacion: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                numero_notificacion: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                OrderLineKey: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                id_estatus_notificacion: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                FchCreacion: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                FchActualizacion: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },

            },
            {
                sequelize,
                tableName: "notificacion",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => notificacion.init(sequelize, DataTypes);
