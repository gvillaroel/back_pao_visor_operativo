const Sequelize = require("sequelize");

class cat_proveedores extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                IDProveedor: {
                    type: DataTypes.STRING(10),
                    primaryKey: true,
                    allowNull: false,
                },
                Alias: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                NombreProveedor: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                Empresa: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                TipoEntrega: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                URLproveedor: {
                    type: DataTypes.STRING(300),
                    allowNull: true,
                }
            },
            {
                sequelize,
                tableName: "cat_proveedores",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => cat_proveedores.init(sequelize, DataTypes);
