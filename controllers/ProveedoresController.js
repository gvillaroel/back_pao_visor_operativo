const log4js = require("log4js");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");
const config = require("../log4js.json");
const {
    createProveedor,
    FetchProveedores,
    FetchProveedoresByGestor,
    updateProveedor,
    deleteProveedor,
} = require("../repositories/CreacionOrden/CatProveedoresRepository");

log4js.configure(config);
const logger = log4js.getLogger("ProveedoresController");

/**
  * Crea un proveedor
  *
  * @param req {JSON} request que contiene el body del nuevo proveedor
  * @param res {JSON} respuesta de la peticion
  */
exports.createProveedor = asyncHandler(async (req, res) => {
    logger.info("En metodo updateLocacion");
    try {
        let proveedor = req.body;
        let newProveedor = await createProveedor(proveedor);
        return clientResponse(res, 200, "success", newProveedor);
    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Recupera los proveedores en BD
  *
  * @param req {JSON} request solicitando los registros
  * @param res {JSON} respuesta de la peticion
  */
exports.getProveedores = asyncHandler(async (req, res) => {
    logger.info("En metodo getProveedores");
    try {
        let proveedores = await FetchProveedores();
        return clientResponse(res, 200, "success", proveedores);
    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Recupera un proveedor buscando por el ID
  *
  * @param req {JSON} request solicitando el registo
  * @param res {JSON} respuesta de la peticion
  */
exports.getProveedoresByID = asyncHandler(async (req, res) => {
    logger.info("En metodo getProveedoresByID");
    try {
        let id = req.params.id
        let proveedor = await FetchProveedoresByGestor(id)
        return clientResponse(res, 200, "success", proveedor);
    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Actualiza un proveedor pasando el ID
  *
  * @param req {JSON} request solicitando el registo
  * @param res {JSON} respuesta de la peticion
  */
exports.updateProveedor = asyncHandler(async (req, res) => {
    logger.info("En metodo proveedor");
    try {
        let id = req.params.id
        let proveedor = req.body
        let updatedProveedor = await updateProveedor(id,proveedor)
        return clientResponse(res, 200, "success", updatedProveedor);
    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});

/**
  * Elimina un proveedor pasando el ID
  *
  * @param req {JSON} request solicitando el borrado
  * @param res {JSON} respuesta de la peticion
  */
exports.deleteProveedor = asyncHandler(async (req, res) => {
    logger.info("En metodo deleteProveedor");
    try {
        let id = req.params.id
        let deletedProveedor = await deleteProveedor(id)
        return clientResponse(res, 200, "success", deletedProveedor);
    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, error.toString(), {});
    }
});
