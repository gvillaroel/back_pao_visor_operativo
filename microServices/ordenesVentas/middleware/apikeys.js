const log4js = require('log4js');
const configlog = require('../log4js.json');
const { sanitize } = require('./sanitize');
const asyncHandler = require('./async');
const clientResponse = require('./clientResponse');

log4js.configure(configlog);
const logger = log4js.getLogger('apikeys');
const {
  FetchOneByKey: FetchApi,
} = require('../repositories/ApikeysRepository');

// Cada ruta nueva debe ser agregada al json y asignarle el nombre de la key
const jsonRutas = {
  '/apivisor/ordenesVenta': 'ordenesVenta',
  '/apivisor/ordenes/pao': '2010',
};

/**
 * Verifica que el token de acceso exista y este registrado en BD.
 *
 * @param req {JSON} request HTTP
 * @param res {JSON} response HTTP
 * @param next {function} funcion que lleva a siguiente servicio
 */
module.exports.apikeys = asyncHandler(async (req, res, next) => {
  // Sanitize every parameter
  const vreq = sanitize(req);
  const { user } = vreq.body;
  try {
    logger.info('En metodo apikeys: ', user);
    logger.info(req.headers ? vreq.headers.host : 'no host', vreq.clientIp);

    const token =
      vreq.headers && vreq.headers.apikey ? vreq.headers.apikey : '';
    const apikey = await FetchApi(token);
    if (apikey === null) {
      clientResponse(res, 403, 'Error en apikeys de acceso.', {});
    } else if (apikey.permitir) {
      if (jsonRutas[req.baseUrl] === apikey.nombre) {
        next();
      } else {
        clientResponse(res, 403, 'Error en apikeys de acceso.', {});
      }
    } else {
      clientResponse(res, 403, 'Apikeys deshabilitada.', {});
    }
  } catch (error) {
    logger.error(error);
    clientResponse(res, 500, error.toString(), {});
  }
});
