/* eslint-disable max-len */
const path = require("path");
const fs = require("fs");
const log4js = require("log4js");
const clientResponse = require("../middleware/clientResponse");
const directorio = "./logs/";
const asyncHandler = require("../middleware/async");
const config = require("../log4js.json");

log4js.configure(config);
const logger = log4js.getLogger("ArchivoLogController");

/**
  * Endpoint para descargar un archivo de logs del POD.
  *
  * @param req {JSON} contiene la informacion del request, en el body viene la info sobre la nueva llave
  * @param res {JSON} la repuesta del servicio
  */
exports.getLogFile = asyncHandler(async (req, res) => {
  logger.info("En metodo getLogFile");
  try {
    const nombreArchivo = req.params.nombre;
    const rutaArchivo = path.join(directorio, nombreArchivo);
    res.download(rutaArchivo, (err) => {
      if (err) {
        logger.error("error al descargar el archivo:", err);
      } else {
        logger.info("Archivo descargado satisfactoriamente");
      }
    });
  } catch (error) {
    logger.error(error);
    clientResponse(res, 500, "error no se encontro nombre de archivo",{});
  }
});

/**
  * Endpoint para mostrar los nombres de los archivos generados.
  *
  * @param req {JSON} contiene la informacion del request, en el body viene la info sobre la nueva llave
  * @param res {JSON} la repuesta del servicio
  */
exports.getLogFilesNames = asyncHandler(async (req, res) => {
  fs.readdir(directorio, (err, archivos) => {
    if (err) {
      logger.error("error al leer el directorio:", err);
      clientResponse(res, 500, "Ocurrió un error al leer archivos.", {});
    }

    logger.info("Archivos en el directorio:");
    archivos.forEach((archivo) => {
      logger.info(archivo);
    });
    clientResponse(res, 200, "Archivos Fetched", archivos);
  });
});
