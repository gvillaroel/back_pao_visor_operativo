const log4js = require("log4js");
const asyncHandler = require("../middleware/async");
const successResponse = require("../middleware/successResponse");
const {
        getInventoryAvailability,
        getInventoryAvailabilityBD,
      } = require("../services/IVInventoryService");
const { processInventoryUpdate } = require("../services/InventoryUpdateProcessorService");

const logger = log4js.getLogger("NodeAvailabilityController");

/**
 * Consulta la disponibilidad de inventario para un centroid y conjunto de skus en Confluent
 * Parámetros recibidos en body JSON:
 * {
 *   "centroid": "0002",
 *   "skus": ["1031250222", "3288846"]
 * }
 */
exports.getAvailability = asyncHandler(async (req, res) => {
  logger.info("En método getAvailability");

  const { centroid, skus, onlyBD } = req.body || {};

  if (centroid === undefined || centroid === null || String(centroid).trim() === "") {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "El parámetro 'centroid' es requerido y no debe estar vacío.",
      data: [],
    });
  }

  if (!skus || !Array.isArray(skus) || skus.length === 0) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "El parámetro 'skus' debe ser un arreglo con al menos un SKU.",
      data: [],
    });
  }

  if (skus.length > 10) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "Se permite un máximo de 10 SKUs por petición.",
      data: [],
    });
  }

  const onlyBDFlag = onlyBD !== undefined && onlyBD === true;
  if (onlyBDFlag) {
    logger.info("Consulta de inventario solo en BD");
  }

  try {
    let availabilityData;

    if (onlyBDFlag) {
      availabilityData = await getInventoryAvailabilityBD(centroid, skus);
    } else {
      availabilityData = await getInventoryAvailability(centroid, skus);
    }

    return successResponse(res, availabilityData, "Disponibilidad de inventario consultada exitosamente", 200);
  } catch (error) {
    logger.error("Error al procesar la consulta de inventario:", error.response?.data || error.message);
    const isTimeout = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
    const statusCode = isTimeout ? 504 : (error.response?.status || (error.isAxiosError ? 502 : 500));

    return res.status(statusCode).json({
      success: false,
      code: statusCode,
      error: error.response?.data?.error?.message?.value || error.message || "Error al consultar inventario en Inventory Visibility",
      data: [],
    });
  }
});

/**
 * Procesa una actualización de inventario enviada por HTTP con la misma
 * estructura y reglas del flujo de Pub/Sub.
 */
exports.processInventoryUpdateHttp = asyncHandler(async (req, res) => {
  logger.info("En método processInventoryUpdateHttp");

  try {
    const result = await processInventoryUpdate(req.body);

    return successResponse(
      res,
      result,
      "Actualización de inventario procesada exitosamente",
      200,
    );
  } catch (error) {
    logger.error("Error al procesar actualización de inventario por HTTP:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      code: statusCode,
      message: error.message || "Error al procesar actualización de inventario",
      data: [],
    });
  }
});
