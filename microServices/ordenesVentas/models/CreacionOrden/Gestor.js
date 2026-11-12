const Sequelize = require("sequelize");

class gestor extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                guia: {
                    type: DataTypes.STRING(50),
                    primaryKey: true,
                    allowNull: false,
                },
                pl3: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                pl3ID: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                repartidor: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                cp: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                remision: {
                    type: DataTypes.STRING(15),
                    allowNull: true,
                },
                referencia: {
                    type: DataTypes.STRING(25),
                    allowNull: true,
                },
                lp: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                estatus_3PL: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                estatus_4PL: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                centro: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                centroNombre: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                destinatario: {
                    type: DataTypes.STRING(60),
                    allowNull: true,
                },
                correo: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                telefono: {
                    type: DataTypes.STRING(24),
                    allowNull: true,
                },
                calle: {
                    type: DataTypes.STRING(150),
                    allowNull: true,
                },
                num_exterior: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                num_interior: {
                    type: DataTypes.STRING(150),
                    allowNull: true,
                },
                entre_calles: {
                    type: DataTypes.STRING(150),
                    allowNull: true,
                },
                asentamiento: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                municipio: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                ciudad: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                estado: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                pais: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                persona_Que_Recibe: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                parentesco: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                firma_Recibido: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                evidencia_Visita: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                },
                estatus_Liv: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                fecha_Hora_GreaGuia: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                fecha_Hora_EStatus: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                motivo: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                usuario_4pl: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                usuario_3pl: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                }
            },
            {
                sequelize,
                tableName: "gestor",
                schema: "cnpao",
                timestamps: false,
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => gestor.init(sequelize, DataTypes);
