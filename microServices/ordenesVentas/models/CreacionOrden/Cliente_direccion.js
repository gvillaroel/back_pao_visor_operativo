const Sequelize = require("sequelize");

class cliente_direccion extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                IDClienteDireccion: {
                    autoIncrement: true,
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                IDCliente: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                AddressLine1: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                AddressLine2: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                AddressLine3: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                AddressLine4: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                AddressLine5: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                AddressLine6: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                AddressHash: {
                    type: DataTypes.STRING(500),
                    allowNull: true,
                },
                City: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                Country: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                State: {
                    type: DataTypes.STRING(35),
                    allowNull: true,
                },
                ZipCode: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                ToAddress: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                Beeper: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                Company: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                Department: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                ErrorTxt: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                EveningFaxNo: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                EveningPhone: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                HttpUrl: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                PreferredShipAddress: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                Suffix: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                UseCount: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                VerificationStatus: {
                    type: DataTypes.STRING(100),
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

            },
            {
                sequelize,
                tableName: "cliente_direccion",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => cliente_direccion.init(sequelize, DataTypes);
