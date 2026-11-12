const Sequelize = require("sequelize");

class cliente extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                IDCliente: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                FirstName: {
                    type: DataTypes.STRING(150),
                    allowNull: true,
                },
                LastName: {
                    type: DataTypes.STRING(64),
                    allowNull: true,
                },
                fch_nacimiento: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                CURP: {
                    type: DataTypes.STRING(18),
                    allowNull: true,
                },
                RFC: {
                    type: DataTypes.STRING(13),
                    allowNull: true,
                },
                genero: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                JobTitle: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                MiddleName: {
                    type: DataTypes.STRING(64),
                    allowNull: true,
                },
                PersonID: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                PersonInfoKey: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                Title: {
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
                tableName: "cliente",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => cliente.init(sequelize, DataTypes);
