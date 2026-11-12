const log4js = require("log4js");
const IVAvailabilityMessage = require("../models/IVAvailabilityMessage");
const productInventoryService = require("./ProductInventoryService");

const logger = log4js.getLogger("InventoryUpdateProcessorService");

/**
 * Procesa un payload de actualización de inventario con las mismas reglas
 * de validación y persistencia que el suscriptor de Pub/Sub.
 *
 * @param {Buffer|string|Object} rawPayload Payload de Inventory Visibility
 * @returns {Promise<Object>} Resumen del procesamiento y auditoría
 */
const processInventoryUpdate = async (rawPayload) => {
  let ivMessage;
  try {
    ivMessage = IVAvailabilityMessage.parse(rawPayload);
  } catch (parseError) {
    const error = new Error(`Fallo de parseo JSON: ${parseError.message}`);
    error.statusCode = 400;
    throw error;
  }

  try {
    ivMessage.validate();
  } catch (validationError) {
    const error = new Error(`Fallo de validación de negocio: ${validationError.message}`);
    error.statusCode = 400;
    throw error;
  }

  logger.info(
    `[InventoryUpdateProcessorService] Mensaje validado. Mensaje ID: ${ivMessage.id}.`,
  );

  const result = await productInventoryService.processAndStoreInventory(ivMessage);
  const auditData = ivMessage.toAuditFormat();

  logger.info(
    `[InventoryUpdateProcessorService] [Auditoría] Datos procesados:\n${JSON.stringify(
      auditData,
      null,
      2,
    )}`,
  );

  return {
    ...result,
  };
};

exports.processInventoryUpdate = processInventoryUpdate;
