const log4js = require("log4js");
const config = require("../../log4js.json");

log4js.configure(config);
const logger = log4js.getLogger("Revisar Integraciones");

const db = require("../../config/db");
const { FetchOneOrdenNum } = require("../../repositories/CreacionOrden/Orden_ventaRepository");
const { UpdateIntegracion } = require("../../repositories/CreacionOrden/IntegracionesRepository");

/**
  * Recibe body de la interfaz 201 para poder almacenar la información de la orden.
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
async function REVISION_INTEGRACION(orden, IDIntegracion) {
    logger.info("En metodo REVISION_INTEGRACION", orden.OrderNo, IDIntegracion);
    // Inicia una nueva transacción
    const transaction = await db.sequelize.transaction();
    let newOrden = null;
    try {
        // Consultar por Numero de orden
        newOrden = await FetchOneOrdenNum(orden.Order.OrderNo);
        logger.info("OrderHeaderKey", newOrden == null ? orden.Order.OrderHeaderKey : newOrden.OrderHeaderKey)
        // Registrar que se ejecuto el cambio en la bitacora
        await UpdateIntegracion(
            {
                OrderHeaderKey: (newOrden == null
                    ? orden.Order.OrderHeaderKey : newOrden.OrderHeaderKey)
            },
            IDIntegracion,
            transaction,
        );

        // Confirma la transacción
        await transaction.commit();

        return { code: 201, data: newOrden == null ? orden.Order : newOrden, message: "Created" };
    } catch (error) {
        logger.error(error);
        await transaction.rollback();

        // Registrar error en la bitacora
        await UpdateIntegracion({ error: error.toString() }, IDIntegracion);
        return { code: 500, data: error.toString(), message: "Error" };
    } finally {
        newOrden = null;
    }
}

module.exports = { REVISION_INTEGRACION };
