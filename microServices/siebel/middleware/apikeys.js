const log4js = require('log4js');
const configlog = require('../log4js.json');
const { sanitize } = require('./sanitize');
const asyncHandler = require('./async');
const clientResponse = require('./clientResponse');

log4js.configure(configlog);
const logger = log4js.getLogger('apikeys');
const { FetchOne } = require('../repositories/ApikeysRepository');

// Cada ruta nueva debe ser agregada al json y asignarle el nombre de la key
const jsonRutas = {
  '/api/consultasiebel/siebel': 'satelite',
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
    logger.info('En metodo auth: ', user);
    logger.info(req.headers ? vreq.headers.host : 'no host', vreq.clientIp);

    const token = vreq.headers ? vreq.headers.apikey : '';
    const apikey = await FetchOne(token);

    if (apikey === null) {
      clientResponse(res, 403, 'error en Token de acceso.', {});
    } else if (apikey?.permitir) {
      if (jsonRutas[req.baseUrl] === apikey.nombre) {
        next();
      } else {
        clientResponse(res, 403, 'error en Token de acceso.', {});
      }
    } else {
      clientResponse(res, 403, 'Token deshabilitado.', {});
    }
  } catch (error) {
    logger.error(error);
    clientResponse(res, 500, error.toString(), {});
  }
});
