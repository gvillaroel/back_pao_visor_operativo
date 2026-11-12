const { Op } = require('sequelize');

module.exports.applyReportFilters = (params) => {
  console.log({ params });
  const {
    // Caracteristicas
    ordenventas,
    containerno,
    clientphone,
    trackingno,
    designcenter,
    email,
    evento,
    // Parametros de caracteristicas
    nodo,
    vendedor,
    fechaIni,
    fechaFin,
    // Reportes (anidados)
    company,
    ordertoso,
    skus,
    statusSO,
    BToSL,
    shipNode,
    createAt,
    asaFlag,
  } = params;
  const where = {};
  const attributes = ['OrderNo', 'OrderDate'];

  // filtros por caracteristicas
  if (ordenventas) {
    where.OrderNo = ordenventas;
  }

  if (containerno) {
    where.ContainerNo = containerno;
  }

  if (clientphone) {
    where[Op.or] = [{ DayPhoneNuevo: clientphone }, { DayPhone: clientphone }];
  }

  if (email) {
    const emailLower = String(email).toUpperCase();
    where[Op.or] = [{ EMailIDNuevo: emailLower }, { EMailID: emailLower }];
  }

  if (evento) {
    where.ExtnGREventID = evento;
  }

  if (trackingno) {
    where.TrackingNo = trackingno;
  }

  if (designcenter) {
    where.ExtnDesignCenterID = designcenter;
  }

  // filtro por cr de entrega
  if (nodo) {
    where.ShipNode = nodo;
  }

  // filtro por localidad/vendedor (número de empleado)
  if (vendedor) {
    where.ExtnEmployeeNumber = vendedor;
  }

  // Filtro por rango de fechas (Fecha estimada de entrega a nivel de linea)
  if (fechaIni && fechaFin) {
    where[Op.or] = [
      {
        ExtnCustomerDeliveryDate: {
          [Op.between]: [
            new Date(fechaIni).setHours(0, 0, 0),
            new Date(fechaFin).setHours(23, 59, 59),
          ],
        },
      },
      {
        'ExtnCustomerDeliveryDate TO': {
          [Op.between]: [
            new Date(fechaIni).setHours(0, 0, 0),
            new Date(fechaFin).setHours(23, 59, 59),
          ],
        },
      },
    ];
  }

  // filtro por empresa
  if (company) {
    where.Empresa = String(company).toUpperCase();
  }

  // filtro por to/so buscar en tablas TOOrder(OrderNo) y en orden_venta(OrderNo) - ordertoso
  if (ordertoso) {
    where[Op.or] = [{ TO: ordertoso }, { OrderNo: ordertoso }];
  }

  // filtro por skus (permitir busqueda multiple separada por coma)
  if (skus) {
    where.ItemID = skus.split(',');
  }

  // filtro por estatus SO
  if (statusSO) {
    where.StatusLine = statusSO;
  }

  // filtro por tipo de linea
  if (BToSL) {
    where.LineType = BToSL;
  }

  // filtro por locación de entrega
  if (shipNode) {
    const shipnodes = shipNode.split(',');
    where[Op.or] = [{ ShipNode: shipnodes }, { ShipNode_TO: shipnodes }];
  }

  // filtro por fecha de creación de la orden
  if (createAt) {
    where.OrderDate = {
      [Op.between]: [
        new Date(createAt).setHours(0, 0, 0),
        new Date(createAt).setHours(23, 59, 59),
      ],
    };
  }

  // filtro por inventario a futuro
  if (asaFlag === 'true') {
    where.inventario_futuro_so = true;
  }

  return { where, attributes };
};

exports.mapDataToReport = (rows) =>
  Array.isArray(rows) && rows.length
    ? rows.map((row) => ({
        Company: row.Empresa,
        OrderNo: row.OrderNo,
        OrderDate: row.OrderDate,
        ItemID: row.ItemID,
        StatusLine: row.StatusLine,
        pause: row.pause,
        Inventario_futuro: row.Inventario_futuro,
        inventario_futuro_so: row.inventario_futuro_so,
        ReqDeliveryDate: row.ReqDeliveryDate,
        ReqDeliveryDate2: row.ReqDeliveryDate2,
        ExtnCustomerDeliveryDate: row.ExtnCustomerDeliveryDate,
        TO: row.TO,
        OrderDateTO: row['OrderDate TO'],
        ItemTO: row['item TO'],
        StatusLineTO: row['status line TO'],
        PauseTO: row['pause TO'],
        FirstShipDateTO: row['FirstShipDate TO'],
        FutureInventoryTO: row.inventario_futuro_TO,
        ReqDeliveryDateTO: row['ReqDeliveryDate TO'],
        ReqDeliveryDate2TO: row['ReqDeliveryDate2 TO'],
        ExtnCustomerDeliveryDateTO: row['ExtnCustomerDeliveryDate TO'],
        NroEnvioTO: row['nuemro envio TO'],
        StatusShipmentTO: row['Status shipment TO'],
        ExpectedDeliveryDateTO: row['ExpectedDeliveryDate TO'],
        ExpectedShipmentDateTO: row['ExpectedShipmentDate TO'],
        ShipNode_TO: row.ShipNode_TO,
        ShipNode: row.ShipNode,
        LineType: row.LineType,
        OrderedQty: row.OrderedQty,
        ClientPhone: row.DayPhoneNuevo || row.DayPhone,
        Email: row.EMailIDNuevo || row.EMailID,
        PrimeLineNo: row.PrimeLineNo,
      }))
    : [];
