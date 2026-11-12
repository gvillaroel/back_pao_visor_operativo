const Sequelize = require("sequelize");

class integraciones extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                IDIntegracion: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    allowNull: false,
                    primaryKey: true,
                },
                Sistema: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                JSONSistema: {
                    type: Sequelize.JSONB,
                    allowNull: true,
                },
                OrderHeaderKey: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                MessageType: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                EstatusEjecucion: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                error: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                FchCreacion: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                FchActualizacion: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                OrderNo: {
                    type: DataTypes.STRING(30),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "integraciones",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => integraciones.init(sequelize, DataTypes);
