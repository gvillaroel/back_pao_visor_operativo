const axios = require("axios");
const https = require("https");
const log4js = require("log4js");
const CircuitBreaker = require("opossum");
const { getAccessToken } = require("./AuthService");
const ProductInventoryRepository = require("../repositories/ProductInventoryRepository");

const logger = log4js.getLogger("IVInventoryService");

const BROKER = (process.env.BROKER_REQUESTS && process.env.BROKER_REQUESTS === "false") ? false : true;

/**
 * Construye la URL para consultar disponibilidad de inventario por centro y SKUs via Broker
 * @param {string} centroid ID del centro
 * @param {Array<string>} skus Lista de SKUs (máximo 10)
 * @returns {string} URL formateada para OData
 */
const buildInventoryUrlBroker = (centroid, skus = []) => {
  let baseUrl = process.env.OMS_INVENTORY_URL || "";
  const safeCentroid = String(centroid).trim();

  // Mapear hasta 10 SKUs completando los vacíos
  const skuParams = [];
  for (let i = 1; i <= 10; i += 1) {
    const pad = i < 10 ? `0${i}` : `${i}`;
    const skuVal = (skus && skus[i - 1]) ? String(skus[i - 1]).trim() : "";
    skuParams.push(`SKU${pad}='${skuVal}'`);
  }

  const queryParams = `(P_CENTROID='${safeCentroid}',${skuParams.join(",")})`;

  if (!BROKER) {
    baseUrl = baseUrl.replace("{tenantId}", process.env.OMS_TENANT_ID);
    return `${baseUrl}`;
  } else {
    return `${baseUrl}${queryParams}`;
  }
};

/**
 * Consulta la disponibilidad de inventario en OMS
 * @param {string|number} centroid ID del centro
 * @param {Array<string>} skus Arreglo con hasta 10 SKUs
 * @param {string} token Token de acceso OAuth2 Bearer
 * @returns {Promise<Array<Object>>} Lista de inventario
 */
const requestInventoryAvailability = async (centroid, skus, token) => {
  const url = buildInventoryUrlBroker(centroid, skus);
  logger.info(`Consultando disponibilidad en OMS: ${url}`);

  const httpsAgent = new https.Agent({
    rejectUnauthorized: process.env.REJECT_UNAUTHORIZED_SSL === "true",
  });

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  const body = {
    "considerSafetyStock": true,
    "considerFulfillmentOptions": true,
    "lines": [
      {
        "lineId": "1",
        "itemId": "Liv_SL_Item001",
        "unitOfMeasure": "UN",
        "productClass": "",
        "deliveryMethod": "PICK",
        "shipNodes": [
          "28",
          "0830-BT"
        ]
      }
    ]
  }

  try {
    const response = await axios.post(url, body, {
      headers,
      httpsAgent,
      timeout: 10000,
    });

    let rawResults = [];
    if (!BROKER) {
      rawResults = response.data?.lines || [];
      let results = [];
      rawResults.forEach((item) => {
        item.shipNodeAvailabilities.forEach((shipNodeAvailability) => {
          results.push({
            "key": item.lineId,
            "skuId": item.itemId,
            "centroId": shipNodeAvailability.shipNode,
            "availableQuantity": shipNodeAvailability.currentAvailability?.availableQuantity,
            "time": shipNodeAvailability.currentAvailability?.toTs
          })
        })
      });
      rawResults = results;
    } else {
      rawResults = response.data?.d?.results || [];
      logger.info("Disponibilidad sin procesar:", rawResults);
    }

    logger.info(`Disponibilidad obtenida con éxito. ${rawResults.length} registros recuperados.`);
    return rawResults;
  } catch (error) {
    logger.error("Error al consultar inventario en Inventory Visibility:", error.response?.data || error.message);
    throw error;
  }
};

const getPositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const availabilityCircuitBreaker = new CircuitBreaker(
  async ({ centroid, skus }) => {
    const token = await getAccessToken();
    return requestInventoryAvailability(centroid, skus, token);
  },
  {
    name: "IV-availability",
    timeout: getPositiveInteger(process.env.OMS_CIRCUIT_BREAKER_TIMEOUT_MS, 45000),
    resetTimeout: getPositiveInteger(process.env.OMS_CIRCUIT_BREAKER_RESET_TIMEOUT_MS, 30000),
    errorThresholdPercentage: 0,
    volumeThreshold: 1,
    errorFilter: (error) => {
      const status = error.response?.status;
      if (status) {
        return status >= 400 && status < 500 && status !== 408 && status !== 429;
      }

      return !error.isAxiosError;
    },
  },
);

const isInventoryVisibilityUnavailable = (error) => {
  if (error.code === "EOPENBREAKER") return true;

  const status = error.response?.status;
  if (status) return status === 408 || status === 429 || status >= 500;

  return error.isAxiosError || error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
};

availabilityCircuitBreaker.fallback(async ({ centroid, skus } = {}, error) => {
  if (!isInventoryVisibilityUnavailable(error)) throw error;

  logger.warn("Inventory Visibility no está disponible; se consultará la disponibilidad en la base de datos.");
  return ProductInventoryRepository.fetchAvailabilityByCentroidAndSkus(centroid, skus);
});

availabilityCircuitBreaker.on("open", () => {
  logger.warn("El servicio de Inventory Visibility no está disponible; se abre el circuit breaker, los datos vendrán de la BD");
});
availabilityCircuitBreaker.on("halfOpen", () => {
  logger.info("Circuit breaker de Inventory Visibility en half-open; se permitirá una solicitud de prueba.");
});
availabilityCircuitBreaker.on("close", () => {
  logger.info("Circuit breaker de Inventory Visibility cerrado; las consultas se reanudan normalmente.");
});
availabilityCircuitBreaker.on("reject", () => {
  logger.warn("Consulta rechazada porque el circuit breaker de Inventory Visibility está abierto.");
});

const getInventoryAvailability = (centroid, skus) =>
  availabilityCircuitBreaker.fire({ centroid, skus });

const getInventoryAvailabilityBD = (centroid, skus) =>
  ProductInventoryRepository.fetchAvailabilityByCentroidAndSkus(centroid, skus);

module.exports = {
  buildInventoryUrlBroker,
  getInventoryAvailability,
  getInventoryAvailabilityBD,
  availabilityCircuitBreaker,
};
