const { getTokenCacheStatus } = require("../services/AuthService");
const asyncHandler = require("../middleware/async");
const config = require("../log4js.json");
const clientResponse = require("../middleware/clientResponse");

/**
  * Se obtiene respuesta para el proceso de healthcheck del GKE de GCP
  *
  * @param req {JSON} no hay request
  * @param res {JSON} respuesta ok vacia solo para validar que el servicio esta disponible
  */
exports.getHealth = asyncHandler(async (req, res) => {
  clientResponse(res, 200, "OK", { authStatus: getTokenCacheStatus() });
});
