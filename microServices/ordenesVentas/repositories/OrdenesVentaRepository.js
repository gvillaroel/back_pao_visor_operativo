const log4js = require('log4js');
const config = require('../log4js.json');
const Sequelize = require('sequelize');
const db = require('../config/db');
const Schema = require('../models/init-models');
const { FormatDate } = require('../functions/FormatDate');
const { DocumentType } = require('../utils/constants');
const { applyReportFilters, mapDataToReport } = require('../utils/reportFilters');
log4js.configure(config);
const logger = log4js.getLogger('OrdenesVentaController');

const { Op } = Sequelize;

const {
  OrdenVenta,
  Linea,
  Envio,
  Cliente,
  Cliente_contacto,
  Producto,
  ClienteDireccion,
  CatLocaciones,
  ToOrder,
  MultiStopTransfers,
  Gestor,
  CatProveedores,
  ReporteOrdenVenta,
} = Schema.default(db.sequelize);

/**
 * Obtiene los registros de Ordenes de la BD dado el numero de telefono del cliente
 *
 * @param id {string} Contiene el numero de telefono del cliente a buscar
 * @return fetched regresa las ordenes buscadas
 */
exports.FetchOrderByClientPhone = async (
  clientPhone,
  page = 1,
  pageSize = 10
) => {
  if (clientPhone !== null) {
    const offset = (page - 1) * pageSize;
    const { count, rows: fetched } = await Cliente_contacto.findAndCountAll({
      attributes: ['IDContacto', 'DayPhone'],
      where: { DayPhone: clientPhone },
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['IDCliente'],
          required: true,
          include: [
            {
              model: OrdenVenta,
              as: 'orden_ventum',
              attributes: [
                'OrderNo',
                'OrderName',
                'SalesOrderNo',
                'DocumentType',
              ],
              required: true,
              include: [
                {
                  model: Linea,
                  as: 'lineas',
                  attributes: ['OrderLineKey', 'ItemID'],
                  required: true,
                  include: [
                    {
                      model: Producto,
                      as: 'productos',
                      attributes: ['ItemDesc'],
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      limit: pageSize,
      offset: offset,
      subQuery: false,
      raw: true,
    });
    const result = fetched.map((item) => ({
      OrderNo: item['cliente.orden_ventum.OrderNo'],
      OrderName: item['cliente.orden_ventum.OrderName'],
      SalesOrderNo: item['cliente.orden_ventum.SalesOrderNo'],
      DocumentType: item['cliente.orden_ventum.DocumentType'],
      ItemID: item['cliente.orden_ventum.lineas.ItemID'],
      ItemDesc: item['cliente.orden_ventum.lineas.productos.ItemDesc'],
      ClientPhone: item.DayPhone
    }));

    const totalRows = parseInt(count, 10);
    const totalRowPages = result.length;
    const numPage = parseInt(page, 10);
    const numPages = Math.ceil(totalRows / pageSize);

    return { data: result, totalRows, totalRowPages, numPage, numPages };
  }
  return null;
};

/**
 * Obtiene los registros de Ordenes de la BD dado un numero de container
 *
 * @param id {string} Contiene el numero de container a buscar
 * @return fetched regresa las ordenes buscadas
 */
exports.FetchOrderByContainerNumber = async (
  containerNo,
  page = 1,
  pageSize = 10
) => {
  if (containerNo !== null) {
    const offset = (page - 1) * pageSize;
    const fetched = await Envio.findAll({
      include: [
        {
          model: Linea,
          foreignKey: 'OrderLineKey', 
          attributes: ['OrderLineKey', 'ItemID', 'OrderHeaderKey'],
          required: true,
          include: [
            {
              model: OrdenVenta,
              foreignKey: 'OrderHeaderKey',
              attributes: [
                'OrderNo',
                'OrderName',
                'DocumentType',
                'SalesOrderNo',
              ],
              required: true,
            },
            {
              model: Producto,
              as: 'productos',
              attributes: ['ItemDesc'],
              required: true,
            },
          ],
        },
      ],
      attributes: ['OrderLineKey', 'ContainerNo', 'IDEnvio'],
      where: { ContainerNo: containerNo },
      raw: true,
      order: [['IDEnvio', 'DESC']],
    });

    const grouped = fetched.reduce((acc, item) => {
      if (
        !acc[item.OrderLineKey] ||
        item.IDEnvio > acc[item.OrderLineKey].IDEnvio
      ) {
        acc[item.OrderLineKey] = item;
      }
      return acc;
    }, {});

    const resultGroup = Object.values(grouped);

    const result = resultGroup.map((item) => ({
      OrderNo: item['linea.orden_ventum.OrderNo'],
      OrderName: orderNameTypeLine(item),
      ItemID: item['linea.ItemID'],
      ItemDesc: item['linea.productos.ItemDesc'],
      IDEnvio: item.IDEnvio,
    }));

    const paginatedResult = result.slice(offset, offset + pageSize);

    const totalRows = parseInt(result.length, 10);
    const totalRowPages = result.length;
    const numPage = parseInt(page, 10);
    const numPages = Math.ceil(totalRows / pageSize);

    return {
      data: paginatedResult,
      totalRows,
      totalRowPages,
      numPage,
      numPages,
    };
  }
  return null;
};

/**
 * Obtiene los registros de Ordenes de la BD
 *
 * @param id {string} Contiene el ID a buscar
 * @return fetched regresa la orden buscada
 */
exports.FetchOrderByID = async (id) => {
  if (id !== null) {
    const fetched = await OrdenVenta.findOne({
      where: {
        OrderNo: id,
      },
      include: [
        {
          model: Linea,
          as: 'linea',
          include: [
            {
              model: Envio,
              as: 'Envios',
            },
          ],
        },
      ],
      attributes: { exclude: ['fchCreacion', 'fchActualizacion'] },
    });
    return fetched;
  }
  return null;
};

/**
 * Obtiene los registros de Orden de ventas de la BD por email
 *
 * @param email {string} Contiene el email a buscar
 * @return fetched regresa ordenes por correo
 */
exports.FetchOrdenVentaByEmail = async (email, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  if (email !== null) {
    const { count, rows: fetched } = await Cliente_contacto.findAndCountAll({
      attributes: ['IDContacto', 'EMailID'],
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('EMailID')),
        Sequelize.fn('LOWER', email)
      ),
      include: [
        {
          model: Cliente,
          as: 'cliente',
          attributes: ['IDCliente'],
          required: true,
          include: [
            {
              model: OrdenVenta,
              as: 'orden_ventum',
              attributes: [
                'OrderNo',
                'OrderName',
              ],
              required: true,
              include: [
                {
                  model: Linea,
                  as: 'lineas',
                  attributes: ['OrderLineKey', 'ItemID'],
                  required: true,
                  include: [
                    {
                      model: Producto,
                      as: 'productos',
                      attributes: ['ItemDesc'],
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      limit: pageSize,
      offset: offset,
      subQuery: false,
      raw: true,
    });
    const result = fetched.map((item) => ({
      OrderNo: item['cliente.orden_ventum.OrderNo'],
      OrderName: item['cliente.orden_ventum.OrderName'],
      ItemID: item['cliente.orden_ventum.lineas.ItemID'],
      ItemDesc: item['cliente.orden_ventum.lineas.productos.ItemDesc'],
      Email: item.EMailID,
    }));
    const totalRows = parseInt(count, 10);
    const totalRowPages = fetched.length;
    const numPage = parseInt(page, 10);
    const numPages = Math.ceil(totalRows / pageSize);

    return { data: result, totalRows, totalRowPages, numPage, numPages };
  }
  return null;
};

/**
 * Obtiene los registros de Ordenes de la BD dado un numero de container
 *
 * @param id {string} Contiene el numero de container a buscar
 * @return fetched regresa las ordenes buscadas
 */
exports.FetchOrderByTrackingNumber = async (
  trackingNo,
  page = 1,
  pageSize = 10
) => {
  if (trackingNo !== null) {
    const offset = (page - 1) * pageSize;
    const fetched = await Envio.findAll({
      include: [
        {
          model: Linea,
          foreignKey: 'OrderLineKey',
          attributes: ['OrderLineKey', 'ItemID', 'OrderHeaderKey'],
          required: true,
          include: [
            {
              model: OrdenVenta,
              foreignKey: 'OrderHeaderKey',
              attributes: [
                'OrderNo',
                'OrderName',
                'DocumentType',
                'SalesOrderNo',
              ],
              required: true,
            },
            {
              model: Producto,
              as: 'productos',
              attributes: ['ItemDesc'],
              required: true,
            },
          ],
        },
      ],
      attributes: ['OrderLineKey', 'ContainerNo', 'IDEnvio'],
      where: { TrackingNo: trackingNo },
      raw: true,
      order: [['IDEnvio', 'DESC']],
    });
    const grouped = fetched.reduce((acc, item) => {
      if (
        !acc[item.OrderLineKey] ||
        item.IDEnvio > acc[item.OrderLineKey].IDEnvio
      ) {
        acc[item.OrderLineKey] = item;
      }
      return acc;
    }, {});

    const resultGroup = Object.values(grouped);

    const result = resultGroup.map((item) => ({
      OrderNo: item['linea.orden_ventum.OrderNo'],
      OrderName: orderNameTypeLine(item),
      ItemID: item['linea.ItemID'],
      ItemDesc: item['linea.productos.ItemDesc'],
      IDEnvio: item.IDEnvio,
    }));

    const paginatedResult = result.slice(offset, offset + pageSize);

    const totalRows = parseInt(result.length, 10);
    const totalRowPages = paginatedResult.length;
    const numPage = parseInt(page, 10);
    const numPages = Math.ceil(totalRows / pageSize);

    return {
      data: paginatedResult,
      totalRows,
      totalRowPages,
      numPage,
      numPages,
    };
  }
  return null;
};

/**
 * Obtiene los registros de Ordenes de la BD por rango de fechas
 *
 * @param fechaIni {string} Contiene la fecha Inicial
 * @param fechaFin {string} Contiene la fecha Final
 * @return fetched regresa las ordenes buscadas
 */
exports.FetchOrdenVentaByRangeDate = async (
  fechaIni,
  fechaFin,
  page = 1,
  pageSize = 10
) => {
  if (fechaIni !== null && fechaFin != null) {
    fechaIni = fechaIni + ' 00:00';
    fechaFin = fechaFin + ' 23:59';
    const offset = (page - 1) * pageSize;
    const fetched = await Linea.findAndCountAll({
      where: {
        ExtnCustomerDeliveryDate: { [Op.between]: [fechaIni, fechaFin] },
      },
      include: [
        {
          model: Producto,
          as: 'productos',
          attributes: ['ItemDesc'],
          required: true,
        },
        {
          model: OrdenVenta,
          foreignKey: 'OrderHeaderKey',
          attributes: [
            'OrderNo',
            'OrderName',
            'OrderHeaderKey',
            'DocumentType',
            'SalesOrderNo',
          ],
          required: true,
        },
      ],
      attributes: ['OrderLineKey', 'ItemID', 'ExtnCustomerDeliveryDate'],
      raw: true,
      limit: pageSize,
      offset: offset,
    });

    const result = fetched.rows.map((item) => ({
      OrderNo: item['orden_ventum.OrderNo'],
      OrderName: orderNameTypeFixed(item),
      ItemID: item.ItemID,
      ItemDesc: item['productos.ItemDesc'],
      DeliveryDate: FormatDate(item.ExtnCustomerDeliveryDate),
    }));

    const totalRows = parseInt(fetched.count, 10);
    const totalRowPages = fetched.length;
    const numPage = parseInt(page, 10);
    const numPages = Math.ceil(totalRows / pageSize);

    return { data: result, totalRows, totalRowPages, numPage, numPages };
  }
  return null;
};

/**
 * Obtiene los registros de Orden de ventas de la BD por eventID
 *
 * @param eventId {string} Contien EventID a buscar
 * @return fetched regresa ordenes event ID
 */
exports.FetchOrdenVentaByEventID = async (eventID, page = 1, pageSize = 10) => {
  if (eventID !== null) {
    const offset = (page - 1) * pageSize;
    const fetched = await Linea.findAndCountAll({
      include: [
        {
          model: Producto,
          as: 'productos',
          attributes: ['ItemDesc'],
          required: true,
        },
        {
          model: OrdenVenta,
          foreignKey: 'OrderHeaderKey',
          where: { ExtnGREventID: eventID },
          attributes: [
            'OrderNo',
            'OrderName',
            'OrderHeaderKey',
            'DocumentType',
            'SalesOrderNo',
          ],
          required: true,
        },
      ],
      attributes: ['OrderLineKey', 'ItemID'],
      raw: true,
      limit: pageSize,
      offset: offset,
    });
    const result = fetched.rows.map((item) => ({
      OrderNo: item['orden_ventum.OrderNo'],
      OrderName: orderNameTypeFixed(item),
      ItemID: item.ItemID,
      ItemDesc: item['productos.ItemDesc'],
    }));

    const totalRows = parseInt(fetched.count, 10);
    const totalRowPages = fetched.length;
    const numPage = parseInt(page, 10);
    const numPages = Math.ceil(totalRows / pageSize);

    return { data: result, totalRows, totalRowPages, numPage, numPages };
  }
  return null;
};

/**
 * Verifica que exista una orden en BD buscando por numero de orden.
 *
 * @param OrderNo {string} Numero de la orden para poder hacer la busqueda
 * @return orden regresa la orden de la BD
 */
exports.FetchOneOrdenByOrdenNo = async (OrderNo) => {
  const order = await OrdenVenta.findOne({
    where: { OrderNo },
    include: [
      {
        model: Linea,
        as: 'Lineas',
        include: [
          {
            model: Envio,
            as: 'Envios',
            attributes: { exclude: ['FchCreacion', 'FchActualizacion'] },
            order: [['FchCreacion', 'DESC']],
          },
          {
            model: Producto,
            as: 'Productos',
            attributes: { exclude: ['FchCreacion', 'FchActualizacion'] },
          },
        ],
        required: true,
        attributes: { exclude: ['FchCreacion', 'FchActualizacion'] },
      },
      {
        model: Cliente,
        as: 'Cliente',
        attributes: {
          exclude: [
            'IDCliente',
            'FchCreacion',
            'CURP',
            'RFC',
            'FchActualizacion',
          ],
        },
        include: [
          {
            model: ClienteContacto,
            as: 'clientContact',
            attributes: {
              exclude: [
                'IDContacto',
                'IDCliente',
                'FchCreacion',
                'FchActualizacion',
              ],
            },
          },
          {
            model: ClienteDireccion,
            as: 'clientDirection',
            attributes: {
              exclude: [
                'FchCreacion',
                'IDCliente',
                'IDClienteDireccion',
                'HttpUrl',
                'UseCount',
                'Suffix',
                'VerificationStatus',
                'FchActualizacion',
              ],
            },
          },
        ],
      },
    ],
    attributes: { exclude: ['FchCreacion', 'FchActualizacion'] },
  });

  return order ? order.dataValues : null; // Maneja el caso de que no se encuentre la orden
};

exports.FetchOneOrderNoOriginal = async (OrderNoOriginal) => {
  const order = await OrdenVenta.findOne({
    where: { OrderNoOriginal },
    include: {
      model: Linea,
      as: 'Lineas',
      attributes: {
        exclude: [
          'id_producto',
          'OrderLineKey',
          'FchCreacion',
          'FchActualizacion',
        ],
      },
      include: {
        model: Producto,
        as: 'Productos',
        attributes: {
          exclude: [
            'id_producto',
            'OrderLineKey',
            'FchCreacion',
            'FchActualizacion',
          ],
        },
      },
    },
    attributes: { exclude: ['FchCreacion', 'FchActualizacion'] },
  });
  return order;
};

exports.FetchLocationByLocationSaleNum = async (locacionVentaNum) => {
  if (locacionVentaNum !== null) {
    const id = parseInt(locacionVentaNum);
    const fetched = await CatLocaciones.findOne({
      where: { LocacionVentaNum: id },
      attributes: { exclude: ['FchCreacion', 'FchActualizacion'] },
    });
    return fetched;
  } else {
    return null;
  }
};

exports.FetchChainedTOByLine = async (OrderLineKey, OrderHeaderKey) => {
  const chainedTO = await ToOrder.findAll({
    where: { OrderLineKey, OrderHeaderKey },
    order: [['FchCreacion', 'DESC']],
    attributes: { exclude: ['FchCreacion', 'FchActualizacion', 'ID_TOOrder'] },
    distinct: true,
    raw: true,
  });
  return chainedTO;
};

exports.FetchMultiStopTransfersByOrdenAndShipNo = async (
  OrderHeaderKey,
  OrderNo,
  ShipmentNo
) => {
  logger.info(
    'En metodo FetchMultiStopTransfersByOrden, OrderHeaderKey',
    OrderHeaderKey,
    ', OrderNo',
    OrderNo,
    ', OrderNo',
    ShipmentNo
  );

  const row = await MultiStopTransfers.findAll({
    where: { OrderHeaderKey, OrderNo, ShipmentNo },
    attributes: { exclude: ['FchCreacion', 'FchActualizacion'] },
    order: [['IdMultiSopts', 'DESC']],
    raw: true,
  });
  return row;
};

exports.FetchOneGestorByGuia = async (guia) => {
  const FetchedGestor = await Gestor.findOne({
    where: { guia },
    attributes: { exclude: ['FchCreacion', 'FchActualizacion'] },
    raw: true,
  });
  return FetchedGestor;
};

exports.FetchProveedoresByIdProveedor = async (IDProveedor) => {
  const listProveedores = await CatProveedores.findOne({
    where: { IDProveedor },
  });
  return listProveedores;
};

exports.FetchReportSalesOrder = async (filters, page, limit) => {
  let offset;
  if (page && limit) {
    offset = (page - 1) * limit;
  }
  const { where } = applyReportFilters(filters);
  console.log('where', where);

  const { rows, count } = await ReporteOrdenVenta.findAndCountAll({
    attributes: { exclude: ['id'] },
    raw: true,
    where,
    limit,
    offset,
  });

  // Construir columnas para el reporte
  const data = mapDataToReport(rows)

  return {
    data,
    totalRows: parseInt(count, 10),
    totalRowPages: data.length,
    numPage: page,
    numPages: Math.ceil(parseInt(count, 10) / limit),
  }
}

const orderNameType = (item) => {
  return item.DocumentType !== DocumentType.salesOrder
    ? item.SalesOrderNo ?? item.OrderName
    : item.OrderName ?? 'Sin información';
};

const orderNameTypeLine = (item) => {
  const DocumentType = item['linea.orden_ventum.DocumentType'];
  const SalesOrderNo = item['linea.orden_ventum.SalesOrderNo'];
  const OrderName = item['linea.orden_ventum.OrderName'];
  return DocumentType !== DocumentType.salesOrder
    ? SalesOrderNo ?? OrderName
    : OrderName ?? 'Sin información';
};
const orderNameTypeFixed = (item) => {
  const DocumentType = item['OrdenVentum.DocumentType'];
  const SalesOrderNo = item['OrdenVentum.SalesOrderNo'];
  const OrderName = item['OrdenVentum.OrderName'];
  return DocumentType !== DocumentType?.SalesOrderNo
    ? SalesOrderNo ?? OrderName
    : OrderName ?? 'Sin información';
};