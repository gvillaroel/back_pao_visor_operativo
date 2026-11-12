/* eslint-disable array-callback-return */
const log4js = require('log4js');
const asyncHandler = require('../middleware/async');

const configlog4 = require('../log4js.json');

log4js.configure(configlog4);
const logger = log4js.getLogger('FolioController');
const successResponse = require('../middleware/successResponse');
const {
  CreateIntegracion,
  ConsultaOrdenVenta,
  UpdateIntegracion,
} = require('../repositories/FolioRepository');
const { CreateIncidencia } = require('../repositories/IncidenciasRepository');
const {
  ConsultaIntegracionByOrdenVenta,
} = require('../repositories/IntegracionesRepository');
const { ca } = require('date-fns/locale');
const { postCherwellData } = require('../services/CherwellService');
const { formatedOrder } = require('../utils/formatedOrder');

exports.saveFolio = asyncHandler(async (req, res) => {
  logger.info('Save Folio');
  try {
    const integracion = {
      Sistema: 'CHERWELL',
      JSONSistema: req.body,
      MessageType: req.body?.action,
      EstatusEjecucion: true,
      OrderHeaderKey: req.body?.OrderNo,
    };
    const newIntegracion = await CreateIntegracion(integracion);
    const linea = await ConsultaOrdenVenta(req.body?.OrderNo, req.body?.SKU);
    if (linea == null) {
      newIntegracion.error = `No se encontró la Orden de Venta No: ${req.body.OrderNo} y el sku: ${req.body.SKU}`;
      await UpdateIntegracion(newIntegracion);
      throw new Error(
        `No se encontró la Orden No:${req.body.OrderNo} y el Sku: ${req.body.SKU}`
      );
    }
    try{
      const newIncidencia = { ...req.body, OrderLineKey: linea.OrderLineKey, Sku: req.body.SKU };
      await CreateIncidencia(newIncidencia);
    } catch (error) {
      newIntegracion.error = `No se actualizó la tabla incidencias para la Orden No: ${req.body.OrderNo} y el sku: ${req.body.SKU}`;
      await UpdateIntegracion(newIntegracion);
      logger.error(' Error :  ' + error);
      throw new Error(
        `No se actualizó la tabla incidencias para la Orden No: ${req.body.OrderNo} y el sku: ${req.body.SKU}`
      );
    }

    if (newIntegracion !== null) {
      successResponse(
        res,
        { response: newIntegracion },
        'Successful operation'
      );
    } else {
      successResponse(res, {}, 'Successful operation');
    }
  } catch (error) {
    logger.error(' Error :  ' + error);
    res.status(500).send({ code: 500, data: {}, error: error.toString() });
  }
});

exports.getIncidentReportInfo = asyncHandler(async (req, res) => {
  logger.info('Get Incident Report Info');
  try {
    const { orderHeaderKey, documentType, sku } = req.params;
    const integracion = await ConsultaIntegracionByOrdenVenta(
      orderHeaderKey,
      documentType
    );

    if (integracion !== null) {
      try {
        const cherWeelResponse = await postCherwellData(integracion?.JSONSistema);
        if (cherWeelResponse.status === 200) {
          const urlBase =
            process.env.CHERWELL_URL_BASE_REDIRECT_INCIDENT_REPORT;
          const orderNo = integracion?.JSONSistema?.Order?.OrderNo;
          successResponse(
            res,
            { response: { urlRedirect: `${urlBase}/${orderNo}${sku}` } },
            'Operación éxitosa',
            200
          );
        } else {
          successResponse(
            res,
            {},
            `Error enviando la información a Cherwell.`,
            500
          );
        }
      } catch (error) {
        logger.error(' Error :  ' + error);
        successResponse(
          res,
          {},
          `Error al enviar la información a Cherwell. ${error.toString()}`,
          500
        );
      }
    } else {
      successResponse(
        res,
        {},
        'No se encontró registro asociado en integraciones',
        400
      );
    }
  } catch (error) {
    logger.error(' Error :  ' + error);
    res.status(500).send({ code: 500, data: {}, error: error.toString() });
  }
});

exports.postIncidentReportInfo = asyncHandler(async (req, res) => {
  logger.info('Get Incident Report Info');
  try {
    const { sku, orden } = req.body;
    const ordeFormated = formatedOrder(orden, '201');
    if (ordeFormated?.Order?.OrderNo === null) {
      successResponse(
        res,
        {},
        'No fue posible identificar el número de orden',
        400
      );
    }
    if (ordeFormated !== null) {
      try {
        const cherWeelResponse = await postCherwellData(ordeFormated);
        if (cherWeelResponse.status === 200) {
          const urlBase =
            process.env.CHERWELL_URL_BASE_REDIRECT_INCIDENT_REPORT;
          const orderNo = ordeFormated?.Order?.OrderNo;
          successResponse(
            res,
            { response: { urlRedirect: `${urlBase}/${orderNo}${sku}` } },
            'Operación éxitosa',
            200
          );
        } else {
          successResponse(
            res,
            {},
            `Error enviando la información a Cherwell.`,
            500
          );
        }
      } catch (error) {
        logger.error(' Error :  ' + error);
        successResponse(
          res,
          {},
          `Error al enviar la información a Cherwell. ${error.toString()}`,
          500
        );
      }
    } else {
      logger.error(' Error :  No se relizo el formateo de la orden', orden);
      successResponse(
        res,
        {},
        'No se relizo el formateo de la orden',
        400
      );
    }
  } catch (error) {
    logger.error(' Error :  ' + error);
    res.status(500).send({ code: 500, data: {}, error: error.toString() });
  }
});