/* eslint-disable consistent-return */
const log4js = require('log4js');
const ErrorResponse = require('../utils/errorResponse');
const successResponse = require('../middleware/successResponse');
const asyncHandler = require('../middleware/async');

// @desc Importing the methods from the model repository;
const {
  FetchOrderByID,
  FetchOneOrdenByOrdenNo,
  FetchOneOrderNoOriginal,
  FetchLocationByLocationSaleNum,
  FetchChainedTOByLine,
  FetchMultiStopTransfersByOrdenAndShipNo,
  FetchOneGestorByGuia,
  FetchProveedoresByIdProveedor,
  FetchReportSalesOrder,
} = require('../repositories/OrdenesVentaRepository');

const config = require('../log4js.json');
const { PAGE_NUMBER, PAGE_SIZE } = require('../utils/constants');
const { generateExcelFile } = require('../utils/exportData');

log4js.configure(config);
const logger = log4js.getLogger('OrdenesVentaController');

exports.getHealth = asyncHandler(async (req, res) => {
  successResponse(res, {}, 'OK');
});

// @desc  Get all rows
// @route GET /oms/api/ordenesVenta
// @access Public
exports.getOrdenInfoById = asyncHandler(async (req, res, next) => {
  try {
    const vreq = req;
    logger.info('En metodo getOrdenInfoById');

    const { orderId } = vreq.params;
    const data = await FetchOrderByID(orderId);

    return successResponse(res, data, 'Orden de Venta Ok', 200, 10, 1, 1, 1);
  } catch (error) {
    logger.error(error);
    return next(new ErrorResponse(error, 404, 2001));
  }
});

// @desc  Get all rows by container number
// @route GET /oms/api/ordenesVenta
// @access Public
exports.getOrdenInfoBy = asyncHandler(async (req, res, next) => {
  try {
    logger.info('En metodo getOrdenInfoBy');

    const {
      page = PAGE_NUMBER,
      page_size = PAGE_SIZE,
      ...filters
    } = req.query;
    const { data, totalRows, totalRowPages, numPage, numPages} = 
      await FetchReportSalesOrder(filters, page, page_size);
    return successResponse(
      res,
      data,
      'Orden de Venta Ok',
      200,
      totalRows,
      totalRowPages,
      numPage,
      numPages
    );
  } catch (error) {
    logger.error(error);
    return next(new ErrorResponse(error, 404, 2001));
  }
});

exports.exportSalesOrdersToExcel = asyncHandler(async (req, res, next) => {
  try {
    logger.info('En metodo exportSalesOrdersToExcel');
    const { data: rows } = await FetchReportSalesOrder(req.query);
    const HEADER_ROW = [
      { value: 'Empresa', fontWeight: 'bold', width: 40 },
      { value: 'Orden Venta', fontWeight: 'bold', width: 50 },
      { value: 'SKU', fontWeight: 'bold', width: 20 },
      { value: 'Teléfono', fontWeight: 'bold', width: 20 },
      { value: 'Correo', fontWeight: 'bold', width: 70 },
      { value: 'Pausa', fontWeight: 'bold', width: 20 },
      { value: 'PrimeLine', fontWeight: 'bold', width: 20 },
      { value: 'Inventario a futuro', fontWeight: 'bold', width: 20 },
      { value: 'Tipo de Artículo', fontWeight: 'bold', width: 20 },
      { value: 'Cantidad', fontWeight: 'bold', width: 20 },
      { value: 'Nodo Origen', fontWeight: 'bold', width: 20 },
      { value: 'Nodo Destino', fontWeight: 'bold', width: 20},
      { value: '#SO SHIPMENT', fontWeight: 'bold', width: 20},
      { value: 'Fecha de entrega', fontWeight: 'bold', width: 100 },
      { value: 'Fecha Creación', fontWeight: 'bold', width: 100 },
      { value: 'Estatus órden de Venta', fontWeight: 'bold', width: 90 },
    ];

    const data = [ HEADER_ROW ];
    rows.forEach(row => {
      data.push([
        { type: String, value: String(row.Company || ''), },
        { type: String, value: String(row.OrderNo || '') },
        { type: String, value: String(row.ItemID || '') },
        { type: String, value: String(row.ClientPhone || '') },
        { type: String, value: String(row.Email || '') },
        { type: String, value: String(row.pause || '').toUpperCase() === 'Y' ? 'Si' : 'No' },
        { type: String, value: String(row.PrimeLineNo || '') },
        { type: String, value: row.inventario_futuro_so ? 'Si' : 'No' },
        { type: String, value: row.LineType ? row.LineType === 'BT' ? 'Big Ticket' : 'Softline' : '' },
        { type: String, value: String(row.OrderedQty || '') },
        { type: String, value: String(row.ShipNode || '') },
        { type: String, value: String(row.ShipNode_TO || '') },
        { type: String, value: String(row.StatusShipmentTO || '') },
        { type: Date, value: row.ExtnCustomerDeliveryDate, format: 'dd/mm/yyyy', width: 100 },
        { type: Date, value: row.OrderDate, format: 'dd/mm/yyyy', width: 100 },
        { type: String, value: String(row.StatusLine || ''), width: 90 }
      ])
    });
    const buffer = await generateExcelFile(data);
    res.setHeader('Content-Disposition', 'attachment; filename=ventas_orden.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    logger.error(error);
    return next(new ErrorResponse(error, 404, 2001));
  }
});

exports.getOrderByOrderNo = asyncHandler(async (req, resp, next) => {
  logger.info('En metodo getOrden');
  try {
    const { OrderNo } = req.params;
    const order = await FetchOneOrdenByOrdenNo(OrderNo);

    // recogido
    let collectedOrder = await FetchOneOrderNoOriginal(order.OrderNo);

    if (collectedOrder !== null) {
      const updaleCollectorLine = collectedOrder.Lineas.map((line) => {
        return {
          ...line.dataValues,
          Item: line.Productos,
          Productos: undefined,
        };
      });
      collectedOrder = {
        ...collectedOrder.dataValues,
        OrderLines: updaleCollectorLine,
        Lineas: undefined,
      };
    }

    const updatedOrderLines = await Promise.all(
      order.Lineas.map(async (line) => {
        const ShipNodeLocacion = await FetchLocationByLocationSaleNum(
          line.ShipNode
        );
        const ReceivingNodeLocacion = await FetchLocationByLocationSaleNum(
          line.ReceivingNode
        );
        const ChainedTO = await buildChainedTo(
          line.OrderLineKey,
          order.OrderHeaderKey
        );

        if (line.Envios && line.Envios.length > 0) {
          const newShipment = await Promise.all(
            line.Envios.map(async (shipment) => {
              const Multi_Stop_Transfers =
                (await FetchMultiStopTransfersByOrdenAndShipNo(
                  order.OrderHeaderKey,
                  order.OrderNo,
                  shipment.ShipmentNo
                )) ?? [];
              const locacion =
                (await FetchLocationByLocationSaleNum(shipment.ShipNode)) ?? {};

              let gestor = null;

              if (
                shipment.TrackingNo !== '' &&
                shipment.TrackingNo !== undefined &&
                shipment.TrackingNo !== null
              ) {
                // Recuperar gestor
                gestor = await FetchOneGestorByGuia(shipment.TrackingNo);

                if (gestor !== null) {
                  // Recuperar proveedor
                  const proveedor = await FetchProveedoresByIdProveedor(
                    gestor.pl3ID
                  );
                  if (typeof proveedor.URLproveedor === 'string') {
                    proveedor.URLproveedor = proveedor.URLproveedor.replace(
                      '<GUIA>',
                      gestor.guia
                    );
                  }
                  gestor.proveedor = proveedor;
                }
              }
              return {
                ...shipment.dataValues,
                locacion,
                Multi_Stop_Transfers,
                gestor,
              };
            })
          );
          line.Envios = newShipment;
        }

        return {
          ...line.dataValues,
          ShipNodeLocacion,
          ReceivingNodeLocacion,
          Shipments: line.Envios ?? [],
          Item: line.Productos[0] ?? [],
          Productos: undefined,
          Envios: undefined,
          ChainedTO,
        };
      })
    );

    const newOderObjectModified = {
      ...order,
      Lineas: undefined,
      Item: order.Productos,
      OrderLines: updatedOrderLines,
      PersonInfoShipTo: {
        ...order.Cliente.dataValues,
        ...order.Cliente.clientContact[0].dataValues,
        ...order.Cliente.clientDirection[0].dataValues,
        clientContact: undefined,
        clientDirection: undefined,
      },
      Cliente: undefined,
      DerivedFromOrder: collectedOrder,
    };

    return successResponse(
      resp,
      newOderObjectModified,
      `Fetchen Orden ${OrderNo}`,
      200
    );
  } catch (error) {
    logger.error(error);
    return next(new ErrorResponse(error, 404, 2001));
  }
});

const buildChainedTo = async (OrderLineKey, OrderHeaderKey) => {
  const chainedFound = await FetchChainedTOByLine(OrderLineKey, OrderHeaderKey);
  if (!chainedFound) {
    return [];
  }

  return Promise.all(
    chainedFound.map(async (itemChained) => {
      const orderTo = await FetchOneOrdenByOrdenNo(itemChained.OrderNo);
      itemChained.MaxStatusDesc = orderTo.MaxStatusDesc;
      itemChained.MinStatusDesc = orderTo.MinStatusDesc;

      const updatedOrderLines = orderTo.Lineas.map((line) => {
        return {
          ...line.dataValues,
          Shipments: line.Envios ?? [],
          Item: line.Productos[0] ?? [],
          Productos: undefined,
          Envios: undefined,
        };
      });

      return { ...itemChained, OrderLines: updatedOrderLines };
    })
  );
};