const log4js = require("log4js");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");
const config = require("../log4js.json");
const {
    createLocacion,
    FetchLocaciones,
    FetchLocacionByID,
    updateLocacion,
    deleteLocacion
} = require("../repositories/CreacionOrden/CatLocacionesRepository")

log4js.configure(config);
const logger = log4js.getLogger("LocacionesController");

/**
  * Crea una locacion
  *
  * @param req {JSON} request que contiene el body de la nueva locacion
  * @param res {JSON} respuesta de la peticion
  */
exports.createLocacion = asyncHandler(async (req, res) => {
    logger.info("En metodo createLocacion");
    try {
        let locacion = req.body
        let newLocacion = await createLocacion(locacion)
        return clientResponse(res, 200, "success", newLocacion);

    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Recupera las locaciones en BD
  *
  * @param req {JSON} request solicitando los registros
  * @param res {JSON} respuesta de la peticion
  */
exports.getLocaciones = asyncHandler(async (req, res) => {
    logger.info("En metodo getLocaciones");
    try {
        let locaciones = await FetchLocaciones()
        return clientResponse(res, 200, "success", locaciones);


    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Recupera una locacion buscando por el ID
  *
  * @param req {JSON} request solicitando el registo
  * @param res {JSON} respuesta de la peticion
  */
exports.getLocacionesByID = asyncHandler(async (req, res) => {
    logger.info("En metodo getLocacionesByID");
    try {
        let id = req.params.id
        let locacion = await FetchLocacionByID(id)
        return clientResponse(res, 200, "success", locacion);

    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Actualiza una locacion pasando el ID
  *
  * @param req {JSON} request solicitando el registo
  * @param res {JSON} respuesta de la peticion
  */
exports.updateLocacion = asyncHandler(async (req, res) => {
    logger.info("En metodo updateLocacion");
    try {
        let id = req.params.id
        let locacion = req.body
        let updatedLocacion = await updateLocacion(id,locacion)
        return clientResponse(res, 200, "success", updatedLocacion);

    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Elimina una locacion pasando el ID
  *
  * @param req {JSON} request solicitando el borrado
  * @param res {JSON} respuesta de la peticion
  */
exports.deleteLocacion = asyncHandler(async (req, res) => {
    logger.info("En metodo deleteLocacion");
    try {
        let id = req.params.id
        let deletedLocacion = await deleteLocacion(id)
        return clientResponse(res, 200, "success", deletedLocacion);

    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});
