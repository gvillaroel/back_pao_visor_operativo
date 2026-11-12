/* eslint-disable max-len */
const path = require("path");
const fs = require("fs");
const log4js = require("log4js");
const successResponse = require("../middleware/successResponse");

const directorio = "./logs/";
const asyncHandler = require("../middleware/async");
const config = require("../log4js.json");

log4js.configure(config);
const logger = log4js.getLogger("ArchivoLogController");

/**
  * Endpoint para descargar un archivo de logs.
  *
  * @param req {JSON} contiene la informacion del request
  * @param res {JSON} la repuesta del servicio
  */
exports.getLogFile = asyncHandler(async (req, res) => {
  logger.info("En metodo getLogFile");
  try {
    const nombreArchivo = req.params.nombre;
    const rutaArchivo = path.join(directorio, nombreArchivo);
    res.download(rutaArchivo, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          logger.error(`No se encontró el archivo ${nombreArchivo}`, err);
          successResponse(res, null, `No se encontró el archivo ${nombreArchivo}`, 404);
        } else {
          logger.error("error al descargar el archivo:", err);
          successResponse(res, null, "Ocurrió un error en la descarga del archivo", 500);
        }
      } else {
        logger.info("Archivo descargado satisfactoriamente");
      }
    });
  } catch (error) {
    logger.error(error);
    successResponse(res, null, "Ocurrió un error en la descarga del archivo", 500);
  }
});

/**
  * Endpoint para mostrar los nombres de los archivos generados.
  *
  * @param req {JSON} contiene la informacion del request
  * @param res {JSON} la repuesta del servicio
  */
exports.getLogFilesNames = asyncHandler(async (req, res) => {
  fs.readdir(directorio, (err, archivos) => {
    if (err) {
      logger.error("error al leer el directorio:", err);
      if (err.code === "ENOENT") {
        successResponse(res, null, "No se encontró el directorio de logs", 404);
      } else {
        successResponse(res, null, "Ocurrió un error al leer archivos.", 500);
      }
    } else {
      logger.info("Archivos en el directorio:");
      archivos.forEach((archivo) => {
        logger.info(archivo);
      });
      successResponse(res, archivos, "Archivos Fetched", 200);
    }
  });
});
