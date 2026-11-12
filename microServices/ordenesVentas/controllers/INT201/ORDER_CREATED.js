const log4js = require("log4js");
const config = require("../../log4js.json");

log4js.configure(config);
const logger = log4js.getLogger("ORDER_CREATED");

const db = require("../../config/db");
const { CreateCliente,FetchOneClienteForCreationTransaction } = require("../../repositories/CreacionOrden/ClienteRepository");
const { CreateClienteContacto } = require("../../repositories/CreacionOrden/ClienteContactoRepository");
const { CreateClienteDireccion, UpdateClienteDireccion } = require("../../repositories/CreacionOrden/ClienteDireccionRepository");
const { SaveClienteDireccionN } = require("../../repositories/CreacionOrden/ClienteDireccionNuevoRepository");
const { CreateLinea, UpdateDerivedPrimeLinea, ValidateReshipParentLineKey, UpdateLinea } = require("../../repositories/CreacionOrden/LineaRepository");
const { CreateProducto } = require("../../repositories/CreacionOrden/ProductoRepository");
const { CreateEnvio } = require("../../repositories/CreacionOrden/EnvioRepository");
const { CreateOrden, FetchOneOrdenNum } = require("../../repositories/CreacionOrden/Orden_ventaRepository");
const { UpdateIntegracion, UpdateIntegracionNoTransact } = require("../../repositories/CreacionOrden/IntegracionesRepository");
const { CreateChainedTO, UpdateChainedTO, FetchChainedTOByLineaItemOrderNo } = require("../../repositories/CreacionOrden/ChainedTORepository");

const { orden_ventaJSON } = require("../../middleware/INT201/Orden_venta");
const { clienteJSON } = require("../../middleware/INT201/Cliente");
const { clienteContactoJSONOrderLine } = require("../../middleware/INT201/Cliente_contacto");
const { clienteDireccionJSON, clienteDireccionAditionalAddressJSON } = require("../../middleware/INT201/Cliente_direccion");
const { lineaJSON } = require("../../middleware/INT201/Linea");
const { productoJSON } = require("../../middleware/INT201/Producto");
const { envioJSON } = require("../../middleware/INT201/Envio");
const { chainedTOJSON } = require("../../middleware/INT201/TOOrder");
const { clienteDireccionNAditionalAddressJSON} = require("../../middleware/INT201/Cliente_direccion_nuevo");
const { SaveClienteNuevo, FetchOneClienteNuevoIfExist } = require("../../repositories/CreacionOrden/ClienteNuevoRepository");
const { Create: CreateComment } = require("../../repositories/CreacionOrden/ComentariosOrdenesRepository");
const { CreateHistoricoComentario } = require("../../repositories/CreacionOrden/HistoricoComentariosRepository");
const { cleanStr, extractValuesByKeywords } = require("../../utils/utils");
/**
  * Recibe body de la interfaz 201 para poder almacenar la información de la orden.
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
async function ORDER_CREATED(data201, IDIntegracion, OrderPK) {
    logger.info("En metodo ORDER_CREATED");
    // Inicia una nueva transacción
    const transaction = await db.sequelize.transaction();

    try {
        // Agregar Cliente
        const cliente = clienteJSON(data201);
        const newCliente = await CreateCliente(cliente, transaction);

        // Agregar Cliente Contacto
        let clienteContacto = {
            IDCliente: newCliente.IDCliente,
            ...clienteContactoJSONOrderLine(data201),
        };
        await CreateClienteContacto(clienteContacto, transaction);

        clienteContacto = null;

        // Agregar Cliente Direccion
        let clienteDireccion = {
            IDCliente: newCliente.IDCliente,
            ...clienteDireccionJSON(data201),
        };
        await CreateClienteDireccion(clienteDireccion, transaction);

        // Update Cliente Direccion Aditional Address
        let xIDClienteNuevo= null;
        if (data201?.OrderLines?.OrderLine[0]?.AdditionalAddresses) {
            const fieldsToUpdateClienteDireccionN = clienteDireccionNAditionalAddressJSON(data201,newCliente.IDCliente)
            await EvaluaSaveClienteDireccionN(fieldsToUpdateClienteDireccionN,transaction)            
            xIDClienteNuevo=newCliente.IDCliente;
        }

        clienteDireccion = null;

        // Agregar Orden
        const orden = {
            OrderHeaderKey: OrderPK,
            OrderNo: data201.OrderNo,
            IDCliente: newCliente.IDCliente,
            IDClienteNuevo: xIDClienteNuevo,
            ...orden_ventaJSON(data201),
        };
        const newOrden = await CreateOrden(orden, transaction);

        // Agregar LINEAS, PRODUCTOS Y ENVIOS
        // Crear un array para almacenar todas las promesas
        let promises = [];

        // Función auxiliar para encontrar un CarrierServiceCode en otras líneas de pedido tipo cascada
        const findCarrierServiceCodeInOrderLines = (orderLines = [], orderLine) => {
            return orderLine?.CarrierServiceCode || orderLines.find(line => line?.CarrierServiceCode)?.CarrierServiceCode || null;
        };

        const processOrderLine = async (OrderPK, OrderLine, data201, transaction) => {
            const { MessageType, OrderLines } = data201;
            // DERIVED
            if(data201?.DocumentType ==='0003'){
                // el primeline derived se debe guardar en la linea origen
                if (OrderLine?.DerivedFromOrderLine?.PrimeLineNo !== null) {
                    const ordenNo = OrderLine?.DerivedFromOrderLine?.Order?.OrderNo;
                    if (ordenNo) {
                        try {
                            const findOrden = await FetchOneOrdenNum(ordenNo);
                            console.log(findOrden)
                            if(findOrden){
                                UpdateDerivedPrimeLinea(
                                    findOrden.OrderHeaderKey, 
                                    OrderLine?.DerivedFromOrderLine?.PrimeLineNo
                                );
                            }
                        } catch (error) {
                            logger.error(`Error al actualizar DerivedPrimeLineNo: ${error.message}`);
                        }
                    } else {
                        logger.info("No se puede actualizar el DerivedPrimeLineNo por falta de OrderNo");
                    }
                } else {
                    logger.info("No se puede actualizar el DerivedPrimeLineNo ya que PrimeLineNo es nulo");
                }
            }

            OrderLine.CarrierServiceCode = MessageType === 'ORDER_CHANGE'
                ? findCarrierServiceCodeInOrderLines(OrderLines?.OrderLine, OrderLine)
                : OrderLine?.CarrierServiceCodes?.CarrierServiceCode?.CarrierServiceCode;

            // LINEAS
            const linea = {
                OrderHeaderKey: OrderPK,
                OrderLineKey: OrderLine.OrderLineKey,
                ...lineaJSON(OrderLine, data201),
            };

            // Consultar linea y validar si es resurtido
            const ReshipParentLineKey = OrderLine?.ReshipParentLineKey ? OrderLine?.ReshipParentLineKey : OrderLine?.ChainedFromOrderLine?.ReshipParentLineKey;
            if ((data201?.DocumentType === "0001" || data201?.DocumentType === "0006") && ReshipParentLineKey) {
                const OrderLineToUpdateReship = data201?.DocumentType === "0006" ? OrderLine?.ChainedFromOrderLine?.OrderLineKey : OrderLine?.OrderLineKey;
                const isReship = ReshipParentLineKey && (await ValidateReshipParentLineKey(OrderLineToUpdateReship));
                if (isReship) {
                    promises.push(
                        UpdateLinea({ isReship, ReshipParentLineKey }, OrderLineToUpdateReship, transaction),
                    );
                }
            }

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
                const envio = {
                    ShipmentNo: shipment.ShipmentNo === "" ? null : shipment.ShipmentNo,
                    OrderLineKey: OrderLine.OrderLineKey,
                    ...envioJSON(shipment, data201)
                };
                if (envio.ShipmentNo !== null) {
                    const createEnvioPromise = CreateEnvio(envio, transaction);
                    promises.push(createEnvioPromise);
                }
            }

            // ChainedTO
            const chainedTOs = Array.isArray(OrderLine.ChainedTOs?.ChainedTO)
                ? OrderLine.ChainedTOs.ChainedTO
                : [OrderLine.ChainedTOs?.ChainedTO].filter(Boolean);
            for (const chainedTo of chainedTOs) {
                const chainTo = {
                    OrderHeaderKey: OrderPK,
                    OrderLineKey: OrderLine?.OrderLineKey,
                    ItemID: OrderLine?.Item?.ItemID ?? null,
                    ...chainedTOJSON(chainedTo, data201)
                };
                if (chainTo.OrderHeaderKey !== null) {
                    let resultado = FetchChainedTOByLineaItemOrderNo(chainTo.OrderLineKey, chainTo.OrderHeaderKey, chainTo.ItemID, chainTo.OrderNo)
                    if (resultado === null || resultado === undefined) {
                        const createChainedTOPromise = CreateChainedTO(chainTo, transaction);
                        promises.push(createChainedTOPromise);
                    } else {
                        const createChainedTOPromise = UpdateChainedTO(chainTo, chainTo.OrderLineKey, chainTo.OrderHeaderKey, chainTo.ItemID, chainTo.OrderNo, transaction);
                        promises.push(createChainedTOPromise);
                    }
                }
            }
        };

        if (data201.MessageType !== "ORDER_OBSERVATION") {
            // Luego, en tu bucle principal:
            if (Array.isArray(data201.OrderLines.OrderLine)) {
                for (const OrderLine of data201.OrderLines.OrderLine) {
                    await processOrderLine(OrderPK, OrderLine, data201, transaction);
                }
            } else {
                await processOrderLine(OrderPK, data201.OrderLines.OrderLine, data201, transaction);
            }

            // Esperar a que todas las promesas se resuelvan
            await Promise.all(promises);

            // Registrar que se ejecuto el cambio en la bitacora
            await UpdateIntegracion({ EstatusEjecucion: true }, IDIntegracion, transaction);
        }

        // Crear notas en caso de ser necesario
        const { Notes, Extn } = data201;
        if (String(Notes?.Note?.NoteText || "").trim()) {
            logger.info("Creando Nota en Comentarios");
            let responsable = Notes?.Note?.ContactUser || Extn?.ExtnUserName || Extn?.ExtnUserID;
            if (!responsable) {
                const [userName, userID] = extractValuesByKeywords(`${Notes.Note.NoteText}`, ["User Name::", "UserID ::"]);
                responsable = userName || userID || "Sin usuario";
            }
            const cleanNote = cleanStr({ str: `${Notes.Note.NoteText}`, replace: "by User Name::" });
            const commentCreated = await CreateComment({
                orden: data201.OrderNo,
                comentario: cleanNote,
                responsable,
            }, { transaction });
            logger.info("Creando Historico de Comentarios");
            await CreateHistoricoComentario({
                id_comentario: commentCreated.id_comentario,
                responsable,
                valor_anterior: null,
                valor_posterior: cleanNote,
                orden: commentCreated.orden,
                executed: true,
            }, { transaction });
        }

        // Confirma la transacción
        await transaction.commit();
        promises = null;

        return { code: 201, data: newOrden, message: "Created" };
    } catch (error) {
        logger.error(error);
        await transaction.rollback();

        // Registrar error en la bitacora
        await UpdateIntegracionNoTransact({ error: error.toString() }, IDIntegracion);
        return { code: 500, data: error.toString(), message: "Error" };
    }
}

async function EvaluaSaveClienteDireccionN(clienteDireccionN,transaction){
    const normalClient = await FetchOneClienteForCreationTransaction(clienteDireccionN.IDCliente,transaction);
    const newCustomer = await SaveClienteNuevo(normalClient,transaction);           
    await SaveClienteDireccionN(clienteDireccionN,transaction);
}

module.exports = { ORDER_CREATED };
