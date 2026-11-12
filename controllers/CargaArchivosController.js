const log4js = require("log4js");
const fs = require("fs");
const csv = require("csvtojson");
const excelToJson = require("convert-excel-to-json");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");
const config = require("../log4js.json");
const { BulkLocaciones } = require("../repositories/CreacionOrden/CatLocacionesRepository")
const { BulkProveedores } = require("../repositories/CreacionOrden/CatProveedoresRepository")

log4js.configure(config);
const logger = log4js.getLogger("CargaArchivosController");

async function tranformFileToJson(file, path, columnToKey) {
  const arrCSV = file.originalname.split(".");

  if (arrCSV[arrCSV.length - 1] === "xlsx") {
    const result = excelToJson({
      sourceFile: path,
      header: {
        rows: 1,
      },
      columnToKey: columnToKey,
    });
    const key = Object.keys(result)[0];
    return result[key];
  }
  if (arrCSV[arrCSV.length - 1] === "csv") {
    return csv({
      noheader: false,
      trim: true,
      delimiter: ",",
    }).fromFile(path);
  }

  return false;
}

/**
  * Carga de catalogos desde archivo
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.CargaArchivoLocaciones = asyncHandler(async (req, res) => {
  logger.info("En metodo CargaArchivoLocaciones");
  try {
    let locaciones = [];
    const path = `./uploads/${req.file.filename}`;
    let columnToKey = {
      A: "Empresa",
      B: "Locación Venta Num",
      C: "Desc Loc Venta",
      D: "Zona",
      E: "Tipo de Locación",
      F: "Es Surtidora",
      G: "Modelo de Cita"
    }
    locaciones = await tranformFileToJson(req.file, path, columnToKey);

    // Elimina el archivo cargado utilizando fs.unlink
    fs.unlink(path, (err) => {
      if (err) {
        logger.info("error al borrar ", path);
        return next(new errorResponse("error al borrar", 500));
      }
    });

    locaciones = locaciones.map(function (item) {
      return {
        "Empresa": item["Empresa"],
        "LocacionVentaNum": item["Locación Venta Num"],
        "NombreProveedor": item["Desc Loc Venta"],
        "Zona": item["Zona"],
        "TipoLocacion": item["Tipo de Locación"],
        "Surtidora": item["Es Surtidora"],
        "ModeloCita": item["Modelo de Cita"]
      }
    })

    let bulk = await BulkLocaciones(locaciones)

    clientResponse(res, 200, "Locaciones cargadas", bulk);

  } catch (error) {
    logger.error(error);
    clientResponse(res, 500, error.toString(), {});
  }
});

/**
  * Carga de catalogos desde archivo
  *
  * @param req {JSON} request para guardar informacion en bitacora
  * @param res {JSON} respuesta de la peticion
  */
exports.CargaArchivoProveedores = asyncHandler(async (req, res) => {
  logger.info("En metodo CargaArchivoProveedores");
  try {
    let proveedores = [];
    const path = `./uploads/${req.file.filename}`;
    let columnToKey = {
      A: "ID Proveedor",
      B: "Alias",
      C: "Nombre Proveedor",
      D: "Empresa",
      E: "Tipo Entrega",
      F: "URL proveedor"
    }
    proveedores = await tranformFileToJson(req.file, path, columnToKey);

    // Elimina el archivo cargado utilizando fs.unlink
    fs.unlink(path, (err) => {
      if (err) {
        logger.info("error al borrar ", path);
        return next(new errorResponse("error al borrar", 500));
      }
    });

    proveedores = proveedores.map(function (item) {
      return {
        "IDProveedor": item["ID Proveedor"],
        "Alias": item["Alias"],
        "NombreProveedor": item["Nombre Proveedor"],
        "Empresa": item["Empresa"],
        "TipoEntrega": item["Tipo Entrega"],
        "URLproveedor": item["URL proveedor"]
      }
    })

    let bulk = await BulkProveedores(proveedores)

    clientResponse(res, 200, "Locaciones cargadas", bulk);

  } catch (error) {
    logger.error(error);
    clientResponse(res, 500, error.toString(),{});
  }
});
