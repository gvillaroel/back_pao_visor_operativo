/* eslint-disable max-len */
const log4js = require("log4js");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");
const config = require("../log4js.json");

const { listosRecogerNdias } = require("../repositories/CreacionOrden/EnvioRepository")
const { FetchLineaByOrderLineKey } = require("../repositories/CreacionOrden/LineaRepository")
const { FetchOneProductoByLinea } = require("../repositories/CreacionOrden/ProductoRepository")
const { FetchOneOrden } = require("../repositories/CreacionOrden/Orden_ventaRepository")
const { FetchOneCliente } = require("../repositories/CreacionOrden/ClienteRepository")
const { FetchOneClienteContactoByClientID } = require("../repositories/CreacionOrden/ClienteContactoRepository")
const { FetchOneClienteDireccionByClientID } = require("../repositories/CreacionOrden/ClienteDireccionRepository")
const { CreateError } = require("../repositories/ErroresRepository")

log4js.configure(config);
const logger = log4js.getLogger("RecordatoriosController");

/**
  * Se regresan las ordenes que lleven n cantidad de días es estatus listo para recoger
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.RecordarioNdias = asyncHandler(async (req, res) => {
    logger.info("En metodo RecordarioNdias");
    try {

        //Validamos si la consulta pide 7 o 11 días
        const diasListoParaRecoger = req.params.dias || ""

        //Buscamos shipments que tengan estatus "Listo para Recoger de 7 u 11 días exactamente"
        let shipments = await listosRecogerNdias(diasListoParaRecoger)

        if(shipments?.length === 0){
            return clientResponse(res, 404, "Ordenes no encontradas.", {});
        }

        let FinalOrdenes = []
        //Recolectar la LINEA y la ORDEN de cada shipment
        for (const shipment of shipments) {

            let OrderLine = await FetchLineaByOrderLineKey(shipment.OrderLineKey)
            let Item = await FetchOneProductoByLinea(shipment.OrderLineKey)
            let order = await FetchOneOrden(OrderLine[0].OrderHeaderKey)
            let client = await FetchOneCliente(order.IDCliente)
            let clientContacto = await FetchOneClienteContactoByClientID(order.IDCliente)
            let clientDireccion = await FetchOneClienteDireccionByClientID(order.IDCliente)

            //Agregar info del cliente a la orden
            order.PersonInfoShipTo = { ...client, ...clientContacto, ...clientDireccion }
            //Agregar item y shipments a la linea
            OrderLine[0].Item = Item
            OrderLine[0].Shipments = [shipment]
            //Agregar a la orden la linea
            order.OrderLines = OrderLine

            FinalOrdenes.push(order)
        }

        clientResponse(res, 200, "Ordenes listas para recoger.", FinalOrdenes);

    } catch (error) {
        logger.error(error);
        await CreateError({ json_body: req.body, error: error.toString() })
        clientResponse(res, 500, error.toString(), {});
    }
});
