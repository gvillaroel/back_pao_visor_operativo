const log4js = require("log4js");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");
const config = require("../log4js.json");

const { FetchOneOrdenByOrdenNo } = require("../repositories/CreacionOrden/Orden_ventaRepository");
const { FetchOneCliente } = require("../repositories/CreacionOrden/ClienteRepository");
const { FetchOneClienteContacto } = require("../repositories/CreacionOrden/ClienteContactoRepository");
const { FetchOneClienteDireccion } = require("../repositories/CreacionOrden/ClienteDireccionRepository");
const { FetchLineaByOrden } = require("../repositories/CreacionOrden/LineaRepository");
const { FetchOneProductoByLinea } = require("../repositories/CreacionOrden/ProductoRepository");
const { FetchEnviosByLinea } = require("../repositories/CreacionOrden/EnvioRepository");
const { FetchLocacionByID } = require("../repositories/CreacionOrden/CatLocacionesRepository");
const { FetchOneGestor } = require("../repositories/CreacionOrden/GestorRepository");
const { FetchProveedoresByGestor } = require("../repositories/CreacionOrden/CatProveedoresRepository");
const { CreateError } = require("../repositories/ErroresRepository");
const { FetchHistoricoIntegraciones } = require("../repositories/CreacionOrden/IntegracionesRepository");

log4js.configure(config);
const logger = log4js.getLogger("OrdenesController");

/**
  * Se consulta el contenido de todas las tablas por el numero de orden igual a 2010
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.getOrden = asyncHandler(async (req, res) => {
  logger.info("En metodo getOrden");
  try {
    const { OrderNo } = req.params;
    const orden = await FetchOneOrdenByOrdenNo(OrderNo);
    // Verificar si se encontró la orden
    if (!orden) {
      // Manejar el caso en el que la orden no se encuentra
      return clientResponse(res, 404, `No se encontraron resultados para la orden ${OrderNo}`, {});
    }
    const cliente = await FetchOneCliente(orden.IDCliente);
    const clienteContacto = await FetchOneClienteContacto(orden.IDCliente);
    const clienteDireccion = await FetchOneClienteDireccion(orden.IDCliente);

    const OrderLines = {};
    OrderLines.OrderLine = await FetchLineaByOrden(orden.OrderHeaderKey);

    const updatedOrderLines = await Promise.all(OrderLines.OrderLine.map(async (line) => {
      line.Item = await FetchOneProductoByLinea(line.OrderLineKey);
      line.ShipNodeLocacion = await FetchLocacionByID(line.ShipNode);
      line.ReceivingNodeLocacion = await FetchLocacionByID(line.ReceivingNode);
      line.Shipments = await FetchEnviosByLinea(line.OrderLineKey);
      for (shipment of line.Shipments) {
        // Buscar almacen o bodega
        if (shipment.ShipNode !== "" && shipment.ShipNode !== undefined && shipment.ShipNode !== null) {
          shipment.locacion = await FetchLocacionByID(shipment.ShipNode);
        }
        // Buscar guia en gestor
        if (shipment.TrackingNo !== "" && shipment.TrackingNo !== undefined && shipment.TrackingNo !== null) {
          // Recuperar gestor
          const gestor = await FetchOneGestor(shipment.TrackingNo);
          if (gestor !== null) {
            // Recuperar proveedor
            const proveedor = await FetchProveedoresByGestor(gestor.pl3ID);
            if (typeof proveedor.URLproveedor === "string") {
              proveedor.URLproveedor = proveedor.URLproveedor.replace("<GUIA>", gestor.guia);
            }
            gestor.proveedor = proveedor;

            shipment.gestor = gestor;
          }
        }
      }
      return line;
    }));

    orden.PersonInfoShipTo = { ...cliente, ...clienteContacto, ...clienteDireccion };
    orden.OrderLines = updatedOrderLines;

    clientResponse(res, 200, `Fetchen Orden ${OrderNo}`, orden);
  } catch (error) {
    logger.error(error);
    await CreateError({ json_body: req.body, error: error.toString() });
    clientResponse(res, 500, error.toString(), {});
  }
});

/**
  * Recibe un numero de orden y se busca todas las integraciones relacionadas.
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.historicoOrden = asyncHandler(async (req, res) => {
  logger.info("En metodo historicoOrden");
  try {
    const { OrderNo } = req.params;
    const historico = await FetchHistoricoIntegraciones(OrderNo);

    clientResponse(res, 200, `Fetchen Orden ${OrderNo}`, { total: historico.length, hisotrico: historico });
  } catch (error) {
    logger.error(error);
    await CreateError({ json_body: req.params, error: error.toString() });
    clientResponse(res, 500, error.toString(), {});
  }
});
