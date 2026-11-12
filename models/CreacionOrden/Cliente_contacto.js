const Sequelize = require("sequelize");

class cliente_contacto extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                "IDContacto": {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true
                },
                "IDCliente": {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                "telefono": {
                    type: DataTypes.STRING(100),
                    allowNull: true
                },
                "tipo": {
                    type: DataTypes.STRING(100),
                    allowNull: true
                },
                "extension_telefonica": {
                    type: DataTypes.STRING(100),
                    allowNull: true
                },
                "AlternateEmailID": {
                    type: DataTypes.STRING(150),
                    allowNull: true
                },
                "DayFaxNo": {
                    type: DataTypes.STRING(100),
                    allowNull: true
                },
                "DayPhone": {
                    type: DataTypes.STRING(40),
                    allowNull: true
                },
                "EMailID": {
                    type: DataTypes.STRING(40),
                    allowNull: true
                },
                "MobilePhone": {
                    type: DataTypes.STRING(40),
                    allowNull: true
                },
                "OtherPhone": {
                    type: DataTypes.STRING(40),
                    allowNull: true
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
                tableName: "cliente_contacto",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => cliente_contacto.init(sequelize, DataTypes);
