/* eslint-disable max-len */
const axios = require("axios");
const log4js = require("log4js");
const moment = require("moment");
const https = require("https");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");
const config = require("../log4js.json");
const { obtenerListaStatusShipment } = require("../utils/utils");

const {
  FetchOneOrdenByOrdenNo, FetchOneOrdenByOrdenNoEmp, FetchOneOrderNoOriginal, OrderBuilder,
} = require("../repositories/CreacionOrden/Orden_ventaRepository");
const { FetchOneCliente } = require("../repositories/CreacionOrden/ClienteRepository");
const { FetchOneClienteContacto, FetchDayPhoneByIdCliente } = require("../repositories/CreacionOrden/ClienteContactoRepository");
const { FetchOneClienteDireccion } = require("../repositories/CreacionOrden/ClienteDireccionRepository");
const { FetchOneClienteNuevo } = require("../repositories/CreacionOrden/ClienteNuevoRepository");
const { FetchOneClienteContactoNuevo } = require("../repositories/CreacionOrden/ClienteContactoNuevoRepository");
const { FetchOneClienteDireccionNuevo } = require("../repositories/CreacionOrden/ClienteDireccionNuevoRepository");
const { FetchLineaByOrden } = require("../repositories/CreacionOrden/LineaRepository");
const { FetchIncidenciasByLinea } = require("../repositories/CreacionOrden/IncidenciaRepository");
const { FetchOneProductoByLinea } = require("../repositories/CreacionOrden/ProductoRepository");
const { FetchEnviosByLinea } = require("../repositories/CreacionOrden/EnvioRepository");
const { FetchLocacionByID } = require("../repositories/CreacionOrden/CatLocacionesRepository");
const { FetchOneGestor } = require("../repositories/CreacionOrden/GestorRepository");
const { FetchProveedoresByGestor } = require("../repositories/CreacionOrden/CatProveedoresRepository");
const { CreateError } = require("../repositories/ErroresRepository");
const { FetchHistoricoIntegraciones } = require("../repositories/CreacionOrden/IntegracionesRepository");
const { FetchChainedTOByLinea } = require("../repositories/CreacionOrden/ChainedTORepository");
const { FetchMultiStopTransfersByOrdenAndShipNo } = require("../repositories/CreacionOrden/MultiStopTransfersRepository");
const { ORDER_UPDATED } = require("./INT201/ORDER_UPDATED");
const { ValidarFechaSoms } = require("./FECHASOMS/logicaFechas");
const { getOrderSystems } = require("../repositories/OrdenesVentaRepository");
const { UltimaIntegracion } = require("./validaciones/ultimaIntegracion");
const { UpdateLineHoldByKeys } = require("../repositories/CreacionOrden/LineaRepository")

log4js.configure(config);
const logger = log4js.getLogger("OrdenesController");

const procesarFechas = (objetos) => objetos.map((shipment) => ({
  ...shipment,
  RequestedDeliveryDate: shipment.RequestedDeliveryDate === null ? "" : new Date(moment(new Date(shipment.RequestedDeliveryDate)).format("YYYY-MM-DD HH:mm:ss UTC")),
  RequestedShipmentDate: shipment.RequestedShipmentDate === null ? "" : new Date(moment(new Date(shipment.RequestedShipmentDate)).format("YYYY-MM-DD HH:mm:ss UTC")),
  ExpectedDeliveryDate: shipment.ExpectedDeliveryDate === null ? "" : new Date(moment(new Date(shipment.ExpectedDeliveryDate)).format("YYYY-MM-DD HH:mm:ss UTC")),
  ExpectedShipmentDate: shipment.ExpectedShipmentDate === null ? "" : new Date(moment(new Date(shipment.ExpectedShipmentDate)).format("YYYY-MM-DD HH:mm:ss UTC")),
  ShipDate: shipment.ShipDate === null ? "" : new Date(moment(new Date(shipment.ShipDate)).format("YYYY-MM-DD HH:mm:ss UTC")),
  StatusDate: shipment.StatusDate === null ? "" : new Date(moment(new Date(shipment.StatusDate)).format("YYYY-MM-DD HH:mm:ss UTC"))
}));

/**
  * Se realiza la construccion del objeto con todos los apartados de informacion
  * que requiera al regresar la informacion de una orden de venta
  *
  * @param in {JSON} el objeto json de la OV al consultar por numero de orden y/o empresa
  * @param out {JSON} respuesta de la peticion
  */
async function procesarOrden(orden) {
  const coincidencias = String(orden.OrderNo).match(/^Y/i);
  const ordenLLenar = orden;
  let salesOrder = {};
  const fecha = new Date(ordenLLenar.OrderDate);
  ordenLLenar.OrderDate = new Date(moment(fecha).format("YYYY-MM-DD HH:mm:ss UTC"));
  ordenLLenar.StatusTimeStamp = ordenLLenar?.StatusTimeStamp === null ? "" : new Date(moment(new Date(ordenLLenar?.StatusTimeStamp)).format("YYYY-MM-DD HH:mm:ss UTC"));
  const [cliente, clienteContacto, clienteDayPhone, clienteDireccion] = await Promise.all([
    FetchOneClienteNuevo(ordenLLenar.IDCliente),
    FetchOneClienteContactoNuevo(ordenLLenar.IDCliente),
    FetchDayPhoneByIdCliente(ordenLLenar.IDCliente),
    FetchOneClienteDireccionNuevo(ordenLLenar.IDCliente)
  ]);

  let salesOrdenNo = ordenLLenar.SalesOrderNo;
  if (orden.DocumentType === "0003") {
    salesOrdenNo = ordenLLenar.OrderNoOriginal;
  }
  if (coincidencias != null) {
    salesOrder_aux = await FetchOneOrdenByOrdenNo(salesOrdenNo);
    if(salesOrder_aux != null){
      salesOrder = salesOrder_aux
      salesOrder.OrderDate = salesOrder?.OrderDate === null ? "" : new Date(moment(new Date(salesOrder?.OrderDate)).format("YYYY-MM-DD HH:mm:ss UTC"));
      // salesOrder = await FetchOneOrdenByOrdenNo(ordenLLenar.SalesOrderNo);
    }
  }

  const ordenRecogido = await FetchOneOrderNoOriginal(ordenLLenar.OrderNo);
  if (ordenRecogido !== null) {
    ordenLLenar.DerivedFromOrder = ordenRecogido;
  }

  for (ordenRecogidoObjeto of ordenLLenar.DerivedFromOrder) {
    ordenRecogidoObjeto.OrderLine = await FetchLineaByOrden(ordenRecogidoObjeto.OrderHeaderKey);
    for (ordenLineObjeto of ordenRecogidoObjeto.OrderLine) {
      ordenLineObjeto.Item = await FetchOneProductoByLinea(ordenLineObjeto.OrderLineKey);
    }
  }

  const OrderLines = {};
  OrderLines.OrderLine = await FetchLineaByOrden(ordenLLenar.OrderHeaderKey);
  const updatedOrderLines = await Promise.all(OrderLines.OrderLine.map(async (line) => {
    let linenueva = null;
    if (ordenLLenar.EnterpriseCode === "LIVERPOOL") {
      linenueva = await ValidarFechaSoms(line, ordenLLenar.OrderNo);
    } else {
      linenueva = line;
      linenueva.ExtnCustomerDeliveryDate = line.ExtnCustomerDeliveryDate === null ? "" : new Date(moment(new Date(line.ExtnCustomerDeliveryDate)).format("YYYY-MM-DD HH:mm:ss UTC"));
    }
    linenueva.ExpectedDeliveryDate = line.ExpectedDeliveryDate === null ? "" : new Date(moment(new Date(line.ExpectedDeliveryDate)).format("YYYY-MM-DD HH:mm:ss UTC"));
    linenueva.Item = await FetchOneProductoByLinea(line.OrderLineKey);
    linenueva.ShipNodeLocacion = await FetchLocacionByID(line.ShipNode);
    linenueva.ReceivingNodeLocacion = await FetchLocacionByID(line.ReceivingNode);
    linenueva.Shipments = await FetchEnviosByLinea(line.OrderLineKey);
    linenueva.Shipments = linenueva.Shipments.filter((envio) => envio.ShipmentNo !== undefined && envio.ShipmentNo !== '' && envio.ShipmentNo !== null);
    linenueva.Shipments = procesarFechas(linenueva.Shipments);
    linenueva.ChainedTO = await FetchChainedTOByLinea(line.OrderLineKey, ordenLLenar.OrderHeaderKey);
    linenueva.Incidents = await FetchIncidenciasByLinea(line.OrderLineKey);

    const statusShipments = await obtenerListaStatusShipment();

    for (const [index, objeto] of linenueva.ChainedTO.entries()) {
      try {
        logger.info("en TO consulta SO", objeto);
        if (objeto.OrderNo !== undefined || objeto.OrderNo !== null) {
          const orderTO = await FetchOneOrdenByOrdenNo(objeto.OrderNo);
          if (orderTO !== null) {
            logger.info("orderTO", orderTO);
            objeto.MaxStatusDesc = orderTO?.MaxOrderStatusDesc ?? null;
            objeto.MinStatusDesc = orderTO?.MinOrderStatusDesc ?? null;
            objeto.OrderLines = await FetchLineaByOrden(orderTO?.OrderHeaderKey);
            for (const [index1, objeto1] of objeto.OrderLines.entries()) {
              logger.info("Dentro de TO Order Line");
              objeto1.ExtnCustomerDeliveryDate = objeto1.ExtnCustomerDeliveryDate === null ? "" : new Date(moment(new Date(objeto1.ExtnCustomerDeliveryDate)).format("YYYY-MM-DD HH:mm:ss UTC"));
              objeto1.ExpectedDeliveryDate = objeto1.ExpectedDeliveryDate === null ? "" : new Date(moment(new Date(objeto1.ExpectedDeliveryDate)).format("YYYY-MM-DD HH:mm:ss UTC"));
              objeto1.Item = await FetchOneProductoByLinea(objeto1.OrderLineKey);
              objeto1.Shipments = await FetchEnviosByLinea(objeto1.OrderLineKey);
              objeto1.Shipments = objeto1.Shipments.filter((envio) => envio.ShipmentNo !== undefined && envio.ShipmentNo !== '' && envio.ShipmentNo !== null);
              objeto1.Shipments = procesarFechas(objeto1.Shipments);

              for (const [index2, objeto2] of objeto1.Shipments.entries()) {
                objeto2.StatusDescriptionPrevio = statusShipments[objeto2.StatusPrevio];
                objeto2.StatusDescription = statusShipments[objeto2.Status];
                objeto2.Multi_Stop_Transfers = await FetchMultiStopTransfersByOrdenAndShipNo(objeto.OrderHeaderKey, objeto.OrderNo, objeto2.ShipmentNo);
              }
            }
          }
        }
      } catch (error) {
        logger.error(error);
      }
    }

    for (shipment of linenueva.Shipments) {
      // Buscar almacen o bodega
      if (shipment.ShipNode !== "" && shipment.ShipNode !== undefined && shipment.ShipNode !== null) {
        shipment.locacion = await FetchLocacionByID(shipment.ShipNode);
      }
      shipment.StatusDescriptionPrevio = statusShipments[shipment.StatusPrevio];
      shipment.StatusDescription = statusShipments[shipment.Status];
      shipment.Multi_Stop_Transfers = await FetchMultiStopTransfersByOrdenAndShipNo(ordenLLenar.OrderHeaderKey, ordenLLenar.OrderNo, shipment.ShipmentNo);
      // Buscar guia en gestor
      if (shipment.TrackingNo !== "" && shipment.TrackingNo !== undefined && shipment.TrackingNo !== null) {
        // Recuperar gestor
        const gestor = await FetchOneGestor(shipment.TrackingNo);
        if (gestor !== null) {
          // Recuperar proveedor
          const proveedor = await FetchProveedoresByGestor(gestor.pl3ID);
          if (typeof proveedor?.URLproveedor === "string" && proveedor?.URLproveedor !== null) {
            proveedor.URLproveedor = proveedor.URLproveedor.replace("<GUIA>", gestor.guia);
          }
          gestor.proveedor = proveedor;

          shipment.gestor = gestor;
        }
      }
    }
    linenueva.ExtnCustomerDeliveryDate = line.ExtnCustomerDeliveryDate == null ? "" : line.ExtnCustomerDeliveryDate;

    return linenueva;
  }));

  ordenLLenar.PersonInfoShipTo = { ...cliente, ...clienteContacto, ...clienteDireccion, DayPhone: clienteDayPhone };
  ordenLLenar.OrderLines = updatedOrderLines;
  ordenLLenar.salesOrder = salesOrder;

  /* if (ordenLLenar) {
    const { max, min, lines } = await FetchLatestOrder(ordenLLenar);
    // ordenLLenar.MaxOrderStatusDesc = max;
    //ordenLLenar.MinOrderStatusDesc = min;
    ordenLLenar.OrderLines.forEach((element) => {
      if (!lines) return
      const findData = lines.find((x) => x?.Item?.ItemID === element?.Item?.ItemID);
      if (findData) element.StatusLine = findData.Status;
    });
  } */

  return ordenLLenar;
}

async function getData2010(datosPost) {
  logger.info("En metodo getData2010");
  try {
    // Se salta la verificación de certificados de urls
    const data = datosPost;
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    const configPost = {
      method: "post",
      url: process.env.APIGEE_INT_2010,
      headers: {
        apikey: process.env.APIGEE_INT_2010_APIKEY,
        "Content-Type": "application/json",
      },
      httpsAgent,
      data,
      timeout: 30000,
    };

    const output = await axios(configPost)
      .then(async (response) => {
        const Data2010 = response;
        return Data2010;
      })
      .catch((error) => {
        logger.error("Error al consultar APIGEE", datosPost);
        logger.error("error: ", error);
        return {
          code: 401,
          error: "Error en consulta 2010",
        };
      });
    return output;
  } catch (error) {
    logger.error("Fallo en metodo getData2010", datosPost.OrderNo);
    logger.error("error: ", error);
    return null;
  }
}

async function consultaIngesta2010(orden, empresa = "") {
  try {
    logger.info("En Metodo consultaIngesta2010");
    let resultado = null;
    const coincidencias = String(orden).match(/^Y/i);
    let data = null
    // Dado que la 2010apigee no acepta request sin empresa
    // Se busca en ambas, se detiene ciclo si hay resultados
    if (coincidencias !== null) {
      data = JSON.stringify({
        OrderNo: orden,
        EnterpriseCode: empresa.toUpperCase(),
        DocumentType: "0006",
      });
      resultado = await getData2010(data);
      // Se busca un recogido si no es una TO
      if (resultado.status !== 200) {
        data = JSON.stringify({
          OrderNo: orden,
          EnterpriseCode: empresa.toUpperCase(),
          DocumentType: "0003",
        });
        resultado = await getData2010(data);
      }
    } else {
      data = JSON.stringify({
        OrderNo: orden,
        EnterpriseCode: empresa.toUpperCase(),
        DocumentType: "0001",
      });
      resultado = await getData2010(data);
    }
    return resultado;
  } catch (error) {
    logger.error("Fallo en metodo consultaIngesta2010", orden);
    return null;
  }
}

/**
  * Se verifica si en APIGee hay un estatus más actualizado para
  * la orden existente
  * @param Orden Número de orden
  * @param Empresa empresa para la cual se busca
  * @param ordenquery query de la orden a actualizar
  */
async function ActualizarOrden(OrdenNo, Empresa = "") {
  try {
    const orden = await FetchOneOrdenByOrdenNoEmp(OrdenNo, Empresa);
    logger.info("Busca en apigee 2010", OrdenNo);

    // se buscan datos en APIgGee para actualizar o bien crear una orden

    const datos_2010 = await consultaIngesta2010(OrdenNo, Empresa);

    if (datos_2010.status === 200) {
      if (orden) {
        // Si existe una orden se debe actualizar
        logger.info("Actualiza orden", OrdenNo);
        const newOrderBuilder = await OrderBuilder(datos_2010.data);
        await ORDER_UPDATED(newOrderBuilder.Order, orden);
        // se manda a llamar metodo de actualizacion
      } else {
        return datos_2010;
      }
    }
  } catch (error) {
    logger.info("Fallo en metodo ActualizarOrden", OrdenNo);
    return null;
  }
}

/**
  * Se verifica si en APIGee hay un estatus más actualizado para
  * la orden existente buscando por liverpool o suburbia
  * @param Orden Número de orden
  * @param ordenquery query de la orden a actualizar
  */
async function ActualizarOrdenNo(OrdenNo) {
  try {
    const orden = await FetchOneOrdenByOrdenNo(OrdenNo);
    logger.info("Busca en apigee 2010", OrdenNo);

    // se buscan datos en APIgGee para actualizar o bien crear una orden
    let datos_2010 = null;
    const datos_2010_liverpool = await consultaIngesta2010(OrdenNo, 'Liverpool');
    if (datos_2010_liverpool.status === 200) {
      datos_2010 = datos_2010_liverpool;
    } else {
      const datos_2010_suburbia = await consultaIngesta2010(OrdenNo, 'Suburbia');
      datos_2010 = datos_2010_suburbia;
    }

    if (datos_2010.status === 200) {
      if (orden) { // should be just orden add ! for testing on dummy
        // Si existe una orden se debe actualizar
        logger.info("Actualiza orden", OrdenNo);
        const newOrderBuilder = await OrderBuilder(datos_2010.data);
        await ORDER_UPDATED(newOrderBuilder.Order, orden);
        // se manda a llamar metodo de actualizacion
      } else {
        return datos_2010;
      }
    }
  } catch (error) {
    logger.info("Fallo en metodo ActualizarOrden", OrdenNo);
    return null;
  }
}
/**
  * Se consulta el contenido de todas las tablas por el numero de orden igual a 2010
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.getOrden = asyncHandler(async (req, res) => {
  logger.info('En metodo getOrden');
  try {
    const { OrderNo } = req.params;
    const datos_2010 = await ActualizarOrdenNo(OrderNo);
    const fechaActual = new Date(moment(new Date()).format('YYYY-MM-DD HH:mm:ss UTC'));
    let orden = await FetchOneOrdenByOrdenNo(OrderNo);
    // Verificar si se encontró la orden
    if (!orden) { // should be !orden remove ! for testing
      if (datos_2010 !== null && datos_2010?.status === 200) {
        // si existe se procesa resultado se ingesta y retorna datos
        logger.info('Orden encontrada en apigee 2010', OrderNo);
        // se procesa
        const newOrderBuilder = await OrderBuilder(datos_2010.data);
        // Antes de enviar el post se valida si existe una integracion en proceso
        const validacionUltimoMinuto = await UltimaIntegracion(OrderNo, fechaActual);
        if (!validacionUltimoMinuto) {
          const configPost = {
            method: 'post',
            url: process.env.URL_INT_201,
            headers: {
              origen: 'INTAPIGEE2010',
              apikey: process.env.URL_INT_201_APIKEY,
              'Content-Type': 'application/json',
            },
            data: newOrderBuilder,
            timeout: 30000,
          };
  
          const output = await axios(configPost)
            .then(async (response) => {
              const Data2010 = response;
              return Data2010;
            })
            .catch((error) => {
              logger.error(error);
              return {
                code: 401,
                error: 'Error en consulta 2010',
              };
            });
          // remove output status === 200 after finish test, works for dummy request
          if (output?.data?.code === 201 || output?.code === 201 || output.status === 200) {
            orden = await FetchOneOrdenByOrdenNo(OrderNo);
            logger.info('Orden Encontrada de APIGEE', orden);
            const ordenProcesada = await procesarOrden(orden);
            return clientResponse(res, 200, `Fetchen Orden ${OrderNo}`, ordenProcesada);
          }
        }
        return clientResponse(res, 404, `No se encontraron resultados para la orden ${OrderNo}`, {});
      }
      // Manejar el caso en el que la orden no se encuentra
      return clientResponse(res, 404, `No se encontraron resultados para la orden ${OrderNo}`, {});
    }

    orden = await procesarOrden(orden);

    clientResponse(res, 200, `Fetchen Orden ${OrderNo}`, orden);
  } catch (error) {
    logger.error(error);
    await CreateError({ json_body: req.body, error: error.toString() });
    clientResponse(res, 500, error.toString(), {});
  }
});

/**
  * Se consulta el contenido de todas las tablas por el numero de orden igual a 2010
  * y por empresa, indicando liverpool o suburbia
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.getOrdenEmp = asyncHandler(async (req, res) => {
  logger.info('En metodo getOrdenEmp');
  try {
    const { OrderNo, Empresa } = req.params;
    // Validar actualizacion de la orden
    const datos_2010 = await ActualizarOrden(OrderNo, Empresa);
    let orden = await FetchOneOrdenByOrdenNoEmp(OrderNo, Empresa);
    const fechaActual = new Date(moment(new Date()).format('YYYY-MM-DD HH:mm:ss UTC'));

    if (!orden) {
      if (datos_2010 !== null && datos_2010?.status === 200) {
        // si existe se procesa resultado se ingesta y retorna datos
        logger.info('Orden encontrada en apigee 2010', OrderNo);
        // se procesa
        const newOrderBuilder = await OrderBuilder(datos_2010.data);
        // Antes de enviar el post se valida si existe una integracion en proceso
        const validacionUltimoMinuto = await UltimaIntegracion(OrderNo, fechaActual);
        if (!validacionUltimoMinuto) {
          const configPost = {
            method: 'post',
            url: process.env.URL_INT_201,
            headers: {
              origen: 'INTAPIGEE2010',
              apikey: process.env.URL_INT_201_APIKEY,
              'Content-Type': 'application/json',
            },
            data: newOrderBuilder,
            timeout: 30000,
          };
  
          const output = await axios(configPost)
            .then(async (response) => {
              const Data2010 = response;
              return Data2010;
            })
            .catch((error) => {
              logger.error(error);
              return {
                code: 401,
                error: 'Error en consulta 2010',
              };
            });
          if (output?.data?.code === 201 || output?.code === 201) {
            orden = await FetchOneOrdenByOrdenNoEmp(OrderNo, Empresa);
            logger.info('Orden Encontrada de APIGEE', orden);
            const ordenProcesada = await procesarOrden(orden);
            return clientResponse(res, 200, `Fetchen Orden ${OrderNo} - ${Empresa}`, ordenProcesada);
          }
        }
        return clientResponse(res, 404, `No se encontraron resultados para la orden ${OrderNo} - ${Empresa}`, {});
      }
      // Manejar el caso en el que la orden no se encuentra
      return clientResponse(res, 404, `No se encontraron resultados para la orden ${OrderNo} - ${Empresa}`, {});
    }
    logger.info('Orden no encontrada APIGEE');
    // logger.info("Orden encontrada", orden);
    orden = await procesarOrden(orden);

    // logger.log("Orden resultado", orden);

    clientResponse(res, 200, `Fetchen Orden ${OrderNo} - ${Empresa}`, orden);
  } catch (error) {
    logger.error(error);
    await CreateError({ json_body: req.body, error: error.toString() });
    clientResponse(res, 500, error.toString(), {});
  }
});

exports.getOrderSystems = asyncHandler(async (req, res) => {
  logger.info('En metodo getOrderSystems');
  try {
    const { OrderNo } = req.params;
    const { systems } = req.query;

    const response = await getOrderSystems({ OrderNo, systems });
    clientResponse(res, 200, `Fetchen Orden ${OrderNo}`, response);
  } catch (error) {
    logger.error(error);
    await CreateError({ json_body: req.body, error: error.toString() });
    clientResponse(res, 500, error.toString(), {});
  }
});