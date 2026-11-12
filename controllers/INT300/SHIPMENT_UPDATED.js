const log4js = require("log4js");
const config = require("../../log4js.json");

log4js.configure(config);
const logger = log4js.getLogger("SHIPMENT_UPDATED");

const db = require("../../config/db");
const { UpdateCliente } = require("../../repositories/CreacionOrden/ClienteRepository");
const { UpdateClienteContacto } = require("../../repositories/CreacionOrden/ClienteContactoRepository");
const { UpdateClienteDireccion } = require("../../repositories/CreacionOrden/ClienteDireccionRepository");
const { FetchOneEnvio, CreateEnvio, UpdateEnvio } = require("../../repositories/CreacionOrden/EnvioRepository");
const { FetchOneLineaByOrderAndSKU, UpdateLinea } = require("../../repositories/CreacionOrden/LineaRepository");
const { UpdateOrden } = require("../../repositories/CreacionOrden/Orden_ventaRepository");
const { UpdateProducto } = require("../../repositories/CreacionOrden/ProductoRepository");
const { UpdateIntegracion } = require("../../repositories/CreacionOrden/IntegracionesRepository");

const { orden_ventaJSON } = require("../../middleware/INT300/Orden_venta");
const { clienteJSON } = require("../../middleware/INT300/Cliente");
const { clienteContactoJSON } = require("../../middleware/INT300/Cliente_contacto");
const { clienteDireccionJSON } = require("../../middleware/INT300/Cliente_direccion");
const { lineaJSON } = require("../../middleware/INT300/Linea");
const { envioJSON } = require("../../middleware/INT300/Envio");
const { productoJSON } = require("../../middleware/INT300/Producto");

async function SHIPMENT_UPDATED(data300, existingOrder, IDIntegracion) {
    logger.info("En metodo SHIPMENT_UPDATED");
    // Inicia una nueva transacción
    const transaction = await db.transaction();
    try {
        // Update Cliente
        let fieldsToUpdateCliente = clienteJSON(data300);
        await UpdateCliente(fieldsToUpdateCliente, existingOrder.IDCliente, transaction);

        // Update Cliente Contacto
        let fieldsToUpdateClienteContacto = clienteContactoJSON(data300);
        await UpdateClienteContacto(fieldsToUpdateClienteContacto, existingOrder.IDCliente, transaction);

        // Update Cliente Direccion
        let fieldsToUpdateClienteDireccion = clienteDireccionJSON(data300);
        await UpdateClienteDireccion(fieldsToUpdateClienteDireccion, existingOrder.IDCliente, transaction);

        // Crear un array para almacenar todas las promesas
        let promises = [];
        let updatedOrden = {};
        for (const ShipmentLine of data300?.ShipmentLines?.ShipmentLine ?? []) {
            // Update Orden
            const fieldsToUpdateOrden = orden_ventaJSON(ShipmentLine.Order, ShipmentLine, data300);
            updatedOrden = await UpdateOrden(fieldsToUpdateOrden, existingOrder.OrderHeaderKey, transaction);

            // Agregar ENVIOS y update LINEA
            let existingLinea = "";
            if (ShipmentLine.OrderLine.Item.ItemID) {
                existingLinea = await FetchOneLineaByOrderAndSKU(existingOrder.OrderHeaderKey, ShipmentLine.OrderLine.Item.ItemID.toString());
            } else {
                existingLinea = await FetchOneLineaByOrderAndSKU(existingOrder.OrderHeaderKey, ShipmentLine.ItemID.toString());
            }

            if (existingLinea !== null) {
                const fieldsToUpdateLinea = lineaJSON(ShipmentLine.OrderLine, ShipmentLine, data300);
                const updateLineaPromise = UpdateLinea(fieldsToUpdateLinea, existingLinea.OrderLineKey, transaction);
                promises.push(updateLineaPromise);

                const fieldsToUpdateProduto = productoJSON(ShipmentLine.OrderLine, ShipmentLine, data300);
                const updateProductoPromise = UpdateProducto(fieldsToUpdateProduto, existingLinea.OrderLineKey, existingLinea.ItemID, transaction);
                promises.push(updateProductoPromise);

                const existingEnvio = await FetchOneEnvio(data300.ShipmentNo, existingLinea.OrderLineKey);

                if (existingEnvio === null) {
                    const envio = { ShipmentNo: data300.ShipmentNo, OrderLineKey: existingLinea.OrderLineKey, ...envioJSON(data300) };
                    const createEnvioPromise = CreateEnvio(envio, transaction);
                    promises.push(createEnvioPromise);
                } else {
                    const updateEnvioPromise = UpdateEnvio(envioJSON(data300), data300.ShipmentNo, transaction);
                    promises.push(updateEnvioPromise);
                }
            }
        }

        // Esperar a que se completen todas las operaciones asincrónicas antes de continuar
        await Promise.all(promises);

        // Registrar que se ejecuto el cambio en la bitacora
        await UpdateIntegracion({ EstatusEjecucion: true }, IDIntegracion, transaction);

        // Confirma la transacción
        await transaction.commit();
        fieldsToUpdateClienteContacto = null;
        fieldsToUpdateCliente = null;
        fieldsToUpdateClienteDireccion = null;
        promises = null;
        // Cerrar la conexión
        // db.close();
        return { code: 201, data: updatedOrden, message: "Order Updated and Shipment Created" };
    } catch (error) {
        logger.error(error);
        await transaction.rollback();
        // Registrar error en la bitacora
        await UpdateIntegracion({ error: error.toString() }, IDIntegracion);
        // Cerrar la conexión
        // db.close();
        return { code: 500, data: error, message: "Error" };
    }
}

module.exports = { SHIPMENT_UPDATED };
