const log4js = require("log4js");
const config = require("../../log4js.json");

log4js.configure(config);
const logger = log4js.getLogger("ORDER_CREATED");

const db = require("../../config/db");
const { CreateCliente } = require("../../repositories/CreacionOrden/ClienteRepository");
const { CreateClienteContacto } = require("../../repositories/CreacionOrden/ClienteContactoRepository");
const { CreateClienteDireccion } = require("../../repositories/CreacionOrden/ClienteDireccionRepository");
const { CreateLinea } = require("../../repositories/CreacionOrden/LineaRepository");
const { CreateProducto } = require("../../repositories/CreacionOrden/ProductoRepository");
const { CreateEnvio } = require("../../repositories/CreacionOrden/EnvioRepository");
const { CreateOrden } = require("../../repositories/CreacionOrden/Orden_ventaRepository");
const { UpdateIntegracion } = require("../../repositories/CreacionOrden/IntegracionesRepository");

const { orden_ventaJSON } = require("../../middleware/INT201/Orden_venta");
const { clienteJSON } = require("../../middleware/INT201/Cliente");
const { clienteContactoJSON } = require("../../middleware/INT201/Cliente_contacto");
const { clienteDireccionJSON } = require("../../middleware/INT201/Cliente_direccion");
const { lineaJSON } = require("../../middleware/INT201/Linea");
const { productoJSON } = require("../../middleware/INT201/Producto");
const { envioJSON } = require("../../middleware/INT201/Envio");

/**
  * Recibe body de la interfaz 201 para poder almacenar la información de la orden.
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
async function ORDER_CREATED(data201, IDIntegracion, OrderPK) {
    logger.info("En metodo ORDER_CREATED");
    // Inicia una nueva transacción
    const transaction = await db.transaction();

    try {
        // Agregar Cliente
        const cliente = clienteJSON(data201);
        const newCliente = await CreateCliente(cliente, transaction);

        // Agregar Cliente Contacto
        let clienteContacto = {
            IDCliente: newCliente.IDCliente,
            ...clienteContactoJSON(data201),
        };
        await CreateClienteContacto(clienteContacto, transaction);

        clienteContacto = null;

        // Agregar Cliente Direccion
        let clienteDireccion = {
            IDCliente: newCliente.IDCliente,
            ...clienteDireccionJSON(data201),
        };
        await CreateClienteDireccion(clienteDireccion, transaction);

        clienteDireccion = null;

        // Agregar Orden
        const orden = {
            OrderHeaderKey: OrderPK,
            OrderNo: data201.OrderNo,
            IDCliente: newCliente.IDCliente,
            ...orden_ventaJSON(data201),
        };
        const newOrden = await CreateOrden(orden, transaction);

        // Agregar LINEAS, PRODUCTOS Y ENVIOS
        // Crear un array para almacenar todas las promesas
        let promises = [];

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
            await processOrderLine(OrderPK, OrderLine, data201, transaction);
        }

        // Esperar a que todas las promesas se resuelvan
        await Promise.all(promises);

        // Registrar que se ejecuto el cambio en la bitacora
        await UpdateIntegracion({ EstatusEjecucion: true }, IDIntegracion, transaction);

        // Confirma la transacción
        await transaction.commit();
        promises = null;

        return { code: 201, data: newOrden, message: "Created" };
    } catch (error) {
        logger.error(error);
        await transaction.rollback();

        // Registrar error en la bitacora
        await UpdateIntegracion({ error: error.toString() }, IDIntegracion);
        return { code: 500, data: error.toString(), message: "Error" };
    }
}

module.exports = { ORDER_CREATED };
