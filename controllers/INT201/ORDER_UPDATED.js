const log4js = require("log4js");
const config = require("../../log4js.json");

log4js.configure(config);
const logger = log4js.getLogger("ORDER_UPDATED");

const db = require("../../config/db");
const { UpdateCliente } = require("../../repositories/CreacionOrden/ClienteRepository");
const { UpdateClienteContacto } = require("../../repositories/CreacionOrden/ClienteContactoRepository");
const { UpdateClienteDireccion } = require("../../repositories/CreacionOrden/ClienteDireccionRepository");
const { FetchOneEnvio, CreateEnvio, UpdateEnvio } = require("../../repositories/CreacionOrden/EnvioRepository");
const { FetchOneLineaByOrderAndSKU, UpdateLinea } = require("../../repositories/CreacionOrden/LineaRepository");
const { UpdateOrden } = require("../../repositories/CreacionOrden/Orden_ventaRepository");
const { UpdateProducto } = require("../../repositories/CreacionOrden/ProductoRepository");
const { UpdateIntegracion } = require("../../repositories/CreacionOrden/IntegracionesRepository");
const { CreateLinea } = require("../../repositories/CreacionOrden/LineaRepository");
const { CreateProducto } = require("../../repositories/CreacionOrden/ProductoRepository");

const { orden_ventaJSON } = require("../../middleware/INT201/Orden_venta");
const { clienteJSON } = require("../../middleware/INT201/Cliente");
const { clienteContactoJSON } = require("../../middleware/INT201/Cliente_contacto");
const { clienteDireccionJSON } = require("../../middleware/INT201/Cliente_direccion");
const { lineaJSON } = require("../../middleware/INT201/Linea");
const { envioJSON } = require("../../middleware/INT201/Envio");
const { productoJSON } = require("../../middleware/INT201/Producto");

async function createOrUpdateEnvio(shipment, existingLinea, data201, OrderLine, transaction) {
    shipment.ShipmentNo = shipment.ShipmentNo ?? (data201.ShipmentNo ?? null);
    const existingEnvio = await FetchOneEnvio(shipment.ShipmentNo, existingLinea.OrderLineKey);

    if (existingEnvio === null) {
        const envio = {
            ShipmentNo: shipment.ShipmentNo,
            OrderLineKey: existingLinea.OrderLineKey,
            ...envioJSON(shipment, OrderLine, data201),
        };
        const createEnvioPromise = CreateEnvio(envio, transaction);
        return createEnvioPromise;
    }
    if (data201.MessageType === "UNCONFIRM_SHIPMENT") {
        shipment.IntentoEntrega = existingEnvio.IntentoEntrega + 1;
    }

    const updateEnvioPromise = UpdateEnvio(
        envioJSON(
            shipment,
            OrderLine,
            data201,
            existingEnvio,
        ),
        shipment.ShipmentNo,
        transaction,
    );
    return updateEnvioPromise;
}

async function ORDER_UPDATED(data201, existingOrder, IDIntegracion) {
    logger.info("En metodo ORDER_UPDATED");
    // Inicia una nueva transacción
    const transaction = await db.transaction();
    try {
        // Update Cliente
        const fieldsToUpdateCliente = clienteJSON(data201);
        await UpdateCliente(fieldsToUpdateCliente, existingOrder.IDCliente, transaction);

        // Update Cliente Contacto
        const fieldsToUpdateClienteContacto = clienteContactoJSON(data201);
        await UpdateClienteContacto(
            fieldsToUpdateClienteContacto,
            existingOrder.IDCliente,
            transaction,
        );

        // Update Cliente Direccion
        const fieldsToUpdateClienteDireccion = clienteDireccionJSON(data201);
        await UpdateClienteDireccion(
            fieldsToUpdateClienteDireccion,
            existingOrder.IDCliente,
            transaction,
        );

        // Update Orden
        const fieldsToUpdateOrden = orden_ventaJSON(data201, existingOrder);
        const updatedOrden = await UpdateOrden(
            fieldsToUpdateOrden,
            existingOrder.OrderHeaderKey,
            transaction,
        );

        // Agregar ENVIOS y update LINEA
        // Crear un array para almacenar todas las promesas
        const promises = [];

        for (const OrderLine of data201.OrderLines.OrderLine) {
            const existingLinea = await FetchOneLineaByOrderAndSKU(existingOrder.OrderHeaderKey, OrderLine.Item.ItemID);

            if (existingLinea !== null) {
                if (OrderLine.Status === "Intento de recogido") {
                    OrderLine.IntentoRecogido = existingLinea.IntentoRecogido + 1;
                }

                const fieldsToUpdateLinea = lineaJSON(OrderLine, data201, existingLinea);
                const updateLineaPromise = UpdateLinea(fieldsToUpdateLinea, existingLinea.OrderLineKey, transaction);
                promises.push(updateLineaPromise);

                const fieldsToUpdateProduto = productoJSON(OrderLine, data201);
                const updateProductoPromise = UpdateProducto(fieldsToUpdateProduto, existingLinea.OrderLineKey, existingLinea.ItemID, transaction);
                promises.push(updateProductoPromise);
                
                if (OrderLine.Shipments !== undefined && OrderLine.Shipments?.Shipment !== undefined) {

                    if (!Array.isArray(OrderLine.Shipments.Shipment)) {
                        OrderLine.Shipments.Shipment = [OrderLine.Shipments.Shipment];
                    }

                    for (const shipment of OrderLine.Shipments.Shipment) {
                        const updateEnvioPromise = await createOrUpdateEnvio(shipment, existingLinea, data201, OrderLine, transaction);
                        promises.push(updateEnvioPromise);
                    }
                } else if (OrderLine.Containers) {
                    if (!Array.isArray(OrderLine.Containers)) {
                        OrderLine.Shipments = { Shipment: [OrderLine.Containers] };
                    }

                    for (let shipment of OrderLine.Shipments.Shipment) {
                        shipment = shipment.Container.Shipment;
                        const updateEnvioPromise = await createOrUpdateEnvio(shipment, existingLinea, data201, OrderLine, transaction);
                        promises.push(updateEnvioPromise);
                    }
                }
                else {
                    logger.info("no hay shipment");
                }
            } else {
                logger.info("no hay linea");
                const promises = [];

                const processOrderLine = async (OrderPK, OrderLine, data201, transaction) => {
                    // LINEAS
                    const linea = {
                        OrderHeaderKey: OrderPK,
                        OrderLineKey: OrderLine.OrderLineKey,
                        ...lineaJSON(OrderLine, data201),
                    };
                    const createLineaPromise = CreateLinea(linea, transaction);
                    promises.push(createLineaPromise);

                    // PRODUCTOS
                    const producto = {
                        OrderLineKey: OrderLine.OrderLineKey,
                        ...productoJSON(OrderLine, data201),
                    };
                    const createProductoPromise = CreateProducto(producto, transaction);
                    promises.push(createProductoPromise);

                    // ENVIOS
                    const shipments = Array.isArray(OrderLine.Shipments?.Shipment)
                        ? OrderLine.Shipments.Shipment : [OrderLine.Shipments?.Shipment].filter(Boolean);
                    for (const shipment of shipments) {
                        const envio = { OrderLineKey: OrderLine.OrderLineKey, ...envioJSON(shipment, data201) };
                        const createEnvioPromise = CreateEnvio(envio, transaction);
                        promises.push(createEnvioPromise);
                    }
                };

                // Luego, en tu bucle principal:
                for (const OrderLine of data201.OrderLines.OrderLine) {
                    await processOrderLine(existingOrder.OrderHeaderKey, OrderLine, data201, transaction);
                }
            }
        }

        // Esperar a que se completen todas las operaciones asincrónicas antes de continuar
        await Promise.all(promises);

        // Registrar que se ejecuto el cambio en la bitacora
        await UpdateIntegracion({ EstatusEjecucion: true }, IDIntegracion, transaction);

        // Confirma la transacción
        await transaction.commit();
        return { code: 201, data: updatedOrden, message: "Order Updated and Shipment Created" };
    } catch (error) {
        logger.error(error);
        await transaction.rollback();
        // Registrar error en la bitacora
        await UpdateIntegracion({ error: error.toString() }, IDIntegracion);
        return { code: 500, data: error.toString(), message: "Error" };
    }
}

module.exports = { ORDER_UPDATED };
