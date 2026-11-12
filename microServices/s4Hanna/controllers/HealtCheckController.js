const log4js = require("log4js");
const asyncHandler = require("../middleware/async");
const config = require("../log4js.json");
const clientResponse = require("../middleware/clientResponse");

log4js.configure(config);
const logger = log4js.getLogger("HealtCheckController");

/**
  * Se obtiente respuesta para el proceso de healthcheck del GKE de GCP
  *
  * @param req {JSON} no hay request
  * @param res {JSON} respuesta ok vacia solo para validar que el servicio esta disponible
  */
exports.getHealth = asyncHandler(async (req, res) => {
  clientResponse(res, 200, "OK", {});
});