const log4js = require("log4js");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");
const config = require("../log4js.json");
const { FetchOneById, FetchAll, Create, Update, Delete } = require("../repositories/ApikeysRepository");

log4js.configure(config);
const logger = log4js.getLogger("ApikeyController");

/**
  * Crea una nueva apiKey.
  *
  * @param req {JSON} contiene la informacion del request, en el body viene la info sobre la nueva llave
  * @param res {JSON} la repuesta del servicio
  * @param next {funcion} ejecuta servicio siguiente
  */
exports.createApikey = asyncHandler(async (req, res, next) => {
    logger.info("En metodo createApikey");
    try {
        let newApikey = await Create(req.body)
        clientResponse(res, 201, "Created", newApikey);
    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Recupera una apiKey.
  *
  * @param req {JSON} contiene la informacion del request, en el body viene la info sobre la nueva llave
  * @param res {JSON} la repuesta del servicio
  * @param next {funcion} ejecuta servicio siguiente
  */
exports.fetchOneApikey = asyncHandler(async (req, res, next) => {
    logger.info("En metodo fetchOneApikey");
    try {

        let apikey = await FetchOneById(req.params.apikey)
        clientResponse(res, 200, "Fetched", apikey);

    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Recupera todas las apiKeys.
  *
  * @param req {JSON} contiene la informacion del request, en el body viene la info sobre la nueva llave
  * @param res {JSON} la repuesta del servicio
  * @param next {funcion} ejecuta servicio siguiente
  */
exports.fetchAllApikey = asyncHandler(async (req, res, next) => {
    logger.info("En metodo fetchAllApikey");
    try {

        let apikeys = await FetchAll()
        clientResponse(res, 200, "Fetched", apikeys);

    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Actualiza una apiKey.
  *
  * @param req {JSON} contiene la informacion del request, en el body viene la info sobre la nueva llave
  * @param res {JSON} la repuesta del servicio
  * @param next {funcion} ejecuta servicio siguiente
  */
exports.updateApikey = asyncHandler(async (req, res, next) => {
    logger.info("En metodo updateApikey");
    try {
        let updatedApikey = await Update(req.body)
        clientResponse(res, 200, "Updated", updatedApikey);

    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
* Elimina una apiKey.
*
* @param req {JSON} contiene la informacion del request, en el body viene la info sobre la nueva llave
* @param res {JSON} la repuesta del servicio
* @param next {funcion} ejecuta servicio siguiente
*/
exports.deleteApikey = asyncHandler(async (req, res, next) => {
    logger.info("En metodo deleteApikey");
    try {

        let deletedApikey = await Delete(req.params.id_key)
        clientResponse(res, 200, "Deleted", deletedApikey);

    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});
