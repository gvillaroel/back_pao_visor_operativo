const Sequelize = require('sequelize');

class Ecc extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    field: 'id',
                },
                zvadrep: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'zvadrep',
                },
                no_solicitud_dev: {
                    type: DataTypes.CHAR(20),
                    allowNull: false,
                    field: 'no_solicitud_dev',
                },
                remision: {
                    type: DataTypes.CHAR(15),
                    allowNull: false,
                    field: 'remision',
                },
                fecha_compra: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'fecha_compra',
                },
                fecha_dev_aplicada:{
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'fecha_dev_aplicada',
                },
                fecha_solicitud_dev: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'fecha_solicitud_dev',
                },
                usuario: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'usuario',
                },
                tda_origen: {
                    type: DataTypes.CHAR(100),
                    allowNull: false,
                    field: 'tda_origen',
                },
                tda_reconocimiento: {
                    type: DataTypes.CHAR(100),
                    allowNull: false,
                    field: 'tda_reconocimiento',
                },
                evento: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                },
                sku: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                },
                descripcion: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                },
                piezas: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                },
                importe: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                },

                estatus_renglon: {
                    type: DataTypes.CHAR(20),
                    allowNull: false,
                    field: 'estatus_renglon',
                },
                recogido: {
                    type: DataTypes.CHAR(20),
                    allowNull: false,
                },
                desc_estatus: {
                    type: DataTypes.CHAR(20),
                    allowNull: false,
                    field: 'desc_estatus',
                },
                comentario: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                },
                bol_dev: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'bol_dev',
                },
                causa: {
                    type: DataTypes.CHAR(50),
                    allowNull: false,
                    field: 'causa',
                },
                desc_tipo_dev: {
                    type: DataTypes.CHAR(100),
                    allowNull: false,
                    field: 'desc_tipo_dev',
                },
                create_time: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                update_time: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                sequelize,
                tableName: 'ecc',
                schema: 'cnpao',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                ],
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => Ecc.init(sequelize, DataTypes);

