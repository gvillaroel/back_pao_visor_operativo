const Sequelize = require("sequelize");

class Xd extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                num_remision: {
                    type: DataTypes.STRING(15),
                    allowNull: true,
                },
                SKU_cve: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                "remision-SKU": {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                    field: "remision-SKU",
                },
                num_pzas: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                num_seccion: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                estatus_remision: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                descripcion_SKU: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                tipo_evento: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                tienda_surtido: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                zona_surtido: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                LP_embalaje: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                num_embarque: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                unidad_transporte: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                nombre_chofer: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                empresa_embarque: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                tipo_entrega: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                tipo_envio: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                AppSurtido_estatusRealizado_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                AppSurtido_estatusRealizado_usuario: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                AppSurtido_estatusRealizado_num_empleado: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                AppSurtido_etiquetaGenerada_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                AppSurtido_etiquetaGenerada_usuario: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                AppSurtido_etiquetaGenerada_num_empleado: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                esperaEntrega_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                esperaEntrega_usuario: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                esperaEntrega_num_empleado: {
                    type: DataTypes.STRING(15),
                    allowNull: true,
                },
                entrega_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                entrega_usuario: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                entrega_num_empleado: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                empacado_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                empacado_usuario: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                empacado_num_empleado: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                confSOMS_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                confSOMS_usuario: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                confSOMS_num_empleado: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                embalado_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                embalado_usuario: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                embalado_num_empleado: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                ruteo_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                ruteo_usuario: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                ruteo_num_empleado: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                embarque_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                embarque_usuario: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                embarque_num_empleado: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                listoRecibir_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                listoRecibir_usuario: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                listoRecibir_num_empleado: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                confirmaRecibe_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                confirmaRecibe_usuario: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                confirmaRecibe_num_empleado: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                "entrega_C&C_fechaHora": {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                    field: "entrega_C&C_fechaHora",
                },
                "entrega_C&C_usuario": {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    field: "entrega_C&C_usuario",
                },
                "entrega_C&C_num_empleado": {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    field: "entrega_C&C_num_empleado",
                },
                "entrega_asesorC&C_usuario": {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    field: "entrega_asesorC&C_usuario",
                },
                "entrega_asesorC&C_num_empleado": {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    field: '"entrega_asesorC&C_num_empleado"',
                },
                "tienda_C&C_recibe": {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    field: "tienda_C&C_recibe",
                },
                "zona_C&C_recibe": {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    field: "zona_C&C_recibe",
                },
                Sterling_rechazadoOrCancel_fechaHora: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                cambio_trazo: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                tipo_mensajeria: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                rechazado_usuario: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                rechazado_num_empleado: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                rechazadoOrCancel_motivo: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                SKU_importe: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                tipo_envoltura: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                "rechazadoOrCancel_id-desc": {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    field: "rechazadoOrCancel_id-desc",
                },
                AppSurtido_proceso_en_linea: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                tienda_destino: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                zona_destino: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                LP_paquete: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                jefe_seccion_usuario: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                jefe_seccion_num_empleado: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                create_time: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                update_time: DataTypes.DATE,
            },
            {
                sequelize,
                tableName: "xd",
                schema: "cnpao",
                timestamps: false,
                indexes: [
                    {
                        name: "xd_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            },
        );
    }
}

module.exports = (sequelize, DataTypes) => Xd.init(sequelize, DataTypes);
