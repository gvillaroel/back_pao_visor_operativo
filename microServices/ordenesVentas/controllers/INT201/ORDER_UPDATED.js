/* eslint-disable no-useless-catch */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const log4js = require("log4js");
const config = require("../../log4js.json");

log4js.configure(config);
const logger = log4js.getLogger("ORDER_UPDATED");

const db = require("../../config/db");
const { UpdateCliente } = require("../../repositories/CreacionOrden/ClienteRepository");
const { SaveClienteNuevo } = require("../../repositories/CreacionOrden/ClienteNuevoRepository");
const { SaveClienteContactoN } = require("../../repositories/CreacionOrden/ClienteContactoNuevoRepository");
const { SaveClienteDireccionN } = require("../../repositories/CreacionOrden/ClienteDireccionNuevoRepository");
const { UpdateClienteContacto } = require("../../repositories/CreacionOrden/ClienteContactoRepository");
const { UpdateClienteDireccion, FetchOneClienteDireccion } = require("../../repositories/CreacionOrden/ClienteDireccionRepository");
const { FetchOneEnvio, CreateEnvio, UpdateEnvio } = require("../../repositories/CreacionOrden/EnvioRepository");
const { FetchOneLineaByOrderLineAndSKU, UpdateLinea, FetchOneLineaByOrderAndSKUAndPrimeLineNo, UpdateDerivedPrimeLinea, FetchLineaByOrderLineKey, ValidateReshipParentLineKey } = require("../../repositories/CreacionOrden/LineaRepository");
const { UpdateOrden ,UpdateOrdenIDClienteNuevo, FetchOneOrdenNum} = require("../../repositories/CreacionOrden/Orden_ventaRepository");
const { UpdateProducto } = require("../../repositories/CreacionOrden/ProductoRepository");
const { UpdateIntegracion, UpdateIntegracionNoTransact, FetchCountIntentosEntrega } = require("../../repositories/CreacionOrden/IntegracionesRepository");
const { CreateLinea } = require("../../repositories/CreacionOrden/LineaRepository");
const { CreateProducto } = require("../../repositories/CreacionOrden/ProductoRepository");
const { CreateChainedTO, FetchChainedTOByLineaItemOrderNo, UpdateChainedTO } = require("../../repositories/CreacionOrden/ChainedTORepository");
const { FetchOneClienteContacto, FetchOneClienteContactoByClientID, UpdateClienteContactoNoTransact } = require("../../repositories/CreacionOrden/ClienteContactoRepository");
const { UpdateClienteNoTransat, FetchOneCliente } = require("../../repositories/CreacionOrden/ClienteRepository");
const { Create: CreateComment } = require("../../repositories/CreacionOrden/ComentariosOrdenesRepository");
const { CreateHistoricoComentario } = require("../../repositories/CreacionOrden/HistoricoComentariosRepository");

const { orden_ventaJSON } = require("../../middleware/INT201/Orden_venta");
const { clienteJSON } = require("../../middleware/INT201/Cliente");
const { clienteNuevoJSON } = require("../../middleware/INT201/Cliente_nuevo");
const { clienteContactoJSONOrderLine, clienteContactoJSONAddressAditional } = require("../../middleware/INT201/Cliente_contacto");
const {clienteContactoNJSONAddressAditional } = require("../../middleware/INT201/Cliente_contacto_nuevo")
const { clienteDireccionJSON, clienteDireccionAditionalAddressJSON } = require("../../middleware/INT201/Cliente_direccion");
const { clienteDireccionNAditionalAddressJSON} = require("../../middleware/INT201/Cliente_direccion_nuevo");

const { lineaJSON } = require("../../middleware/INT201/Linea");
const { envioJSON } = require("../../middleware/INT201/Envio");
const { productoJSON } = require("../../middleware/INT201/Producto");
const { chainedTOJSON } = require("../../middleware/INT201/TOOrder");
const { cleanStr, extractValuesByKeywords } = require("../../utils/utils");

function verificarDiferencias(objeto1, objeto2) {
    // Iterar sobre las propiedades del primer objeto
    for (const clave in objeto1) {
        // Verificar si la propiedad existe en el segundo objeto
        if (objeto2.hasOwnProperty(clave)) {
            // Comparar los valores de las propiedades
            if (objeto1[clave] !== objeto2[clave]) {
                // Si los valores son diferentes, hay una diferencia
                return true;
            }
        } else {
            // Si la propiedad no existe en el segundo objeto, hay una diferencia
            return true;
        }
    }

    // Iterar sobre las propiedades del segundo objeto para buscar propiedades adicionales en objeto2 que no están en objeto1
    for (const clave in objeto2) {
        if (!objeto1.hasOwnProperty(clave)) {
            // Si hay una propiedad en objeto2 que no está en objeto1, hay una diferencia
            return true;
        }
    }

    // Si no se encontraron diferencias, devolver false
    return false;
}

async function createOrUpdateEnvio(shipment, existingLinea, data201, OrderLine, transaction) {
    try {
        shipment.ShipmentNo = shipment.ShipmentNo ?? (data201.ShipmentNo ?? null);
        shipment.ShipmentNo = shipment.ShipmentNo === "" ? null : shipment.ShipmentNo;

        // Validar que sea una TO para consultar el envío y luego actualizarlo
        const relationalRecords = Boolean(shipment?.DocumentType === "0006");
        const OrderChainedTo = OrderLine?.ChainedTOs?.ChainedTO?.OrderNo ?? null;

        const existingEnvio = await FetchOneEnvio(shipment.ShipmentNo, existingLinea.OrderLineKey, { relationalRecords, OrderNo: OrderChainedTo });

        if (data201.MessageType === "UNCONFIRM_SHIPMENT") {
            shipment.IntentoEntrega = await FetchCountIntentosEntrega(existingLinea.OrderHeaderKey, existingLinea.OrderLineKey, shipment.ShipmentNo);
        } else {
            shipment.IntentoEntrega = await FetchCountIntentosEntrega(existingLinea.OrderHeaderKey, existingLinea.OrderLineKey, shipment.ShipmentNo);
        }

        if (existingEnvio === null) {
            const envio = {
                ShipmentNo: shipment.ShipmentNo,
                OrderLineKey: existingLinea.OrderLineKey,
                ...envioJSON(shipment, OrderLine, data201),
            };
            if (envio.ShipmentNo !== null) {
                const createEnvioPromise = CreateEnvio(envio, transaction);
                return createEnvioPromise;
            }
        }

        if (shipment.ShipmentNo !== null) {
            const updateEnvioPromise = await UpdateEnvio(
                envioJSON(
                    shipment,
                    OrderLine,
                    data201,
                    existingEnvio,
                ),
                shipment.ShipmentNo,
                transaction,
                existingEnvio.OrderLineKey,
            );
            return updateEnvioPromise;
        }
    } catch (error) {
        throw error;
    }
}

async function ProcesarLineas(existingOrder, data201, OrderLine, transaction) {
    try {
        // const existingLinea = await FetchOneLineaByOrderLineAndSKU(existingOrder.OrderHeaderKey, OrderLine.OrderLineKey, OrderLine.Item.ItemID, PrimeLineNo);
        //DERIVED
        if(data201?.DocumentType ==='0003'){
            // el primeline derived se debe guardar en la linea origen
            if (OrderLine?.DerivedFromOrderLine?.PrimeLineNo !== null) {
                const ordenNo = OrderLine?.DerivedFromOrderLine?.Order?.OrderNo;
                if (ordenNo) {
                    try {
                        const findOrden = await FetchOneOrdenNum(ordenNo);
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

        const existingLinea = await FetchOneLineaByOrderAndSKUAndPrimeLineNo(existingOrder.OrderHeaderKey, OrderLine.Item.ItemID, OrderLine.PrimeLineNo);
        // logger.info("OrderLineKey", existingLinea?.OrderLineKey)

        if (existingLinea !== null) {
            // Agregar ENVIOS y update LINEA
            // Crear un array para almacenar todas las promesas
            const promises = [];
            console.log("Existe Order Line");
            if (OrderLine.Status === "Intento de recogido") {
                OrderLine.IntentoRecogido = existingLinea.IntentoRecogido + 1;
            }

            const fieldsToUpdateLinea = lineaJSON(OrderLine, data201, existingLinea);

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
            const updateLineaPromise = UpdateLinea(fieldsToUpdateLinea, existingLinea.OrderLineKey, transaction);
            promises.push(updateLineaPromise);

            const fieldsToUpdateProduto = productoJSON(OrderLine, data201);
            const updateProductoPromise = UpdateProducto(fieldsToUpdateProduto, existingLinea.OrderLineKey, existingLinea.ItemID, transaction);
            promises.push(updateProductoPromise);

            // Envios
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
            } else {
                logger.info("no hay shipment");
            }

            // ChainedTO
            const chainedTOs = Array.isArray(OrderLine.ChainedTOs?.ChainedTO)
                ? OrderLine.ChainedTOs.ChainedTO
                : [OrderLine.ChainedTOs?.ChainedTO].filter(Boolean);
            for (const chainedTo of chainedTOs) {
                const chainTo = {
                    OrderHeaderKey: existingOrder.OrderHeaderKey,
                    OrderLineKey: OrderLine?.OrderLineKey,
                    ItemID: OrderLine?.Item?.ItemID ?? null,
                    ...chainedTOJSON(chainedTo, data201),
                };
                if (chainTo.OrderHeaderKey !== null) {
                    const resultado = await FetchChainedTOByLineaItemOrderNo(chainTo.OrderLineKey, chainTo.OrderHeaderKey, chainTo.ItemID, chainTo.OrderNo);
                    if (resultado.length === 0) {
                        const createChainedTOPromise = CreateChainedTO(chainTo, transaction);
                        promises.push(createChainedTOPromise);
                    } else {
                        const createChainedTOPromise = UpdateChainedTO(chainTo, chainTo.OrderLineKey, chainTo.OrderHeaderKey, chainTo.ItemID, chainTo.OrderNo, transaction);
                        promises.push(createChainedTOPromise);
                    }
                }
            }
            // Esperar a que se completen todas las operaciones asincrónicas antes de continuar
            await Promise.all(promises);
        } else {
            logger.info("no hay linea");
            const promises = [];

            // Función auxiliar para encontrar un CarrierServiceCode en otras líneas de pedido tipo cascada
            const findCarrierServiceCodeInOrderLines = (orderLines = [], orderLine) => {
                return orderLine?.CarrierServiceCode || orderLines.find(line => line?.CarrierServiceCode)?.CarrierServiceCode || null;
            };

            const processOrderLine = async (OrderPK, OrderLine, data201, transaction) => {
                const { MessageType, OrderLines } = data201;

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
                    const envio = { OrderLineKey: OrderLine.OrderLineKey, ...envioJSON(shipment, data201) };
                    const createEnvioPromise = CreateEnvio(envio, transaction);
                    promises.push(createEnvioPromise);
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
                        ...chainedTOJSON(chainedTo, data201),
                    };
                    if (chainTo.OrderHeaderKey !== null) {
                        const createChainedTOPromise = CreateChainedTO(chainTo, transaction);
                        promises.push(createChainedTOPromise);
                    }
                }
            };
            await processOrderLine(existingOrder.OrderHeaderKey, OrderLine, data201, transaction);

            // Esperar a que se completen todas las operaciones asincrónicas antes de continuar
            await Promise.all(promises);
        }
    } catch (error) {
        throw error;
    }
}

async function actualizaClienteContactoDireccionNuevo (data201, existingOrder,transaction) {
    try {        
        if ( data201?.OrderLines?.OrderLine[0]?.AdditionalAddresses ==null ||
            Object.keys(data201?.OrderLines?.OrderLine[0]?.AdditionalAddresses).length === 0 ){ 
        //No hay datos en AdditionalAddresses          
            return null     
        }       
        const fieldsClienteNuevo = clienteNuevoJSON(data201,existingOrder);
        const clienteNuevo= await SaveClienteNuevo(fieldsClienteNuevo,transaction);

        const fieldsToUpdateContactoN =clienteContactoNJSONAddressAditional(data201,existingOrder.IDCliente)
        await SaveClienteContactoN(fieldsToUpdateContactoN,transaction)
        
        const fieldsToUpdateDireccionN =clienteDireccionNAditionalAddressJSON(data201,existingOrder.IDCliente)
        await SaveClienteDireccionN(fieldsToUpdateDireccionN,transaction)
        
        return clienteNuevo;
    } catch (error) {
        logger.error(error);
        throw error;
    }    

}

async function ORDER_UPDATED(data201, existingOrder, IDIntegracion) {
    logger.info("En metodo ORDER_UPDATED");
    // Inicia una nueva transacción
    const transaction = await db.sequelize.transaction();
    try {        
        const clienteNuevo =await actualizaClienteContactoDireccionNuevo(data201, existingOrder,transaction)

        // Update Orden
        const fieldsToUpdateOrden = orden_ventaJSON(data201, existingOrder);
        const updatedOrden = await UpdateOrden(
            fieldsToUpdateOrden,
            existingOrder.OrderHeaderKey,
            transaction,
        );

        if (data201.MessageType !== "ORDER_OBSERVATION") {
            if (Array.isArray(data201.OrderLines.OrderLine)) {
                for (const OrderLine of data201.OrderLines.OrderLine) {
                    await ProcesarLineas(existingOrder, data201, OrderLine, transaction);
                }
            } else {
                await ProcesarLineas(existingOrder, data201, data201.OrderLines.OrderLine, transaction);
            }
    
            // Registrar que se ejecuto el cambio en la bitacora
            if (IDIntegracion !== undefined) {
                await UpdateIntegracion({ EstatusEjecucion: true }, IDIntegracion, transaction);
            }
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
            const cleanNote = cleanStr({ str: `${Notes.Note.NoteText}`, replace: "by User Name::" }).substring(0, 50);
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
        if (clienteNuevo !=null){
            await UpdateOrdenIDClienteNuevo(
                {IDClienteNuevo: clienteNuevo.IDCliente},            
                existingOrder.OrderHeaderKey,
                transaction,
            );
        }
        return { code: 201, data: updatedOrden, message: "Order Updated and Shipment Created" };
    } catch (error) {
        logger.error(error);
        await transaction.rollback();
        // Registrar error en la bitacora
        if (IDIntegracion !== undefined) {
            await UpdateIntegracionNoTransact({ error: error.toString() }, IDIntegracion);
        }
        return { code: 500, data: error.toString(), message: "Error" };
    }
}

module.exports = { ORDER_UPDATED };
