const axios = require("axios");
const https = require("https");
const log4js = require("log4js");

const logger = log4js.getLogger("AuthService");

// Almacén en memoria del token y su expiración
let tokenMemoryCache = {
  accessToken: null,
  tokenType: "Bearer",
  expiresAt: 0,
};

// Promesa en vuelo para evitar llamadas concurrentes simultáneas al solicitar token
let pendingTokenPromise = null;

/**
 * Construye la URL completa del endpoint de autenticación OAuth2 de OMS
 * @returns {string} URL completa
 */
const buildAuthUrl = () => {
  const baseUrl = (process.env.OMS_AUTH_URL || "").replace(/\/+$/, "");
  const tenantId = process.env.OMS_TENANT_ID || "";
  let authPath = process.env.OMS_AUTH_PATH || "/inventory/{tenantId}/v1/oauth2/token";

  if (authPath.includes("{tenantId}")) {
    authPath = authPath.replace("{tenantId}", tenantId);
  }

  if (!authPath.startsWith("/")) {
    authPath = `/${authPath}`;
  }

  return `${baseUrl}${authPath}`;
};

/**
 * Obtiene un nuevo token de acceso mediante OAuth2 client_credentials
 * @returns {Promise<string>} Token de acceso generado
 */
const requestNewToken = async () => {
  const tokenUrl = buildAuthUrl();
  const clientId = process.env.OMS_CLIENT_ID || "";
  const clientSecret = process.env.OMS_CLIENT_SECRET || "";

  logger.info(`Solicitando nuevo token de autenticación a OMS: ${tokenUrl}`);

  // Base64(clientId:clientSecret)
  const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const httpsAgent = new https.Agent({
    rejectUnauthorized: process.env.REJECT_UNAUTHORIZED_SSL === "true",
  });

  const headers = {
    Authorization: `Basic ${base64Credentials}`,
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const bodyData = "grant_type=client_credentials";

  try {
    const response = await axios.post(tokenUrl, bodyData, {
      headers,
      httpsAgent,
      timeout: 30000,
    });

    const { token_type, access_token, expires_in } = response.data || {};

    if (!access_token) {
      throw new Error("La respuesta del servicio de autenticación no contiene 'access_token'");
    }

    // Determinar duración del token: variable en config.env o expires_in de la respuesta
    const configuredTtlSec = process.env.OMS_TOKEN_CACHE_EXPIRES_IN_SEC
      ? parseInt(process.env.OMS_TOKEN_CACHE_EXPIRES_IN_SEC, 10)
      : null;

    const ttlSeconds = (configuredTtlSec && !Number.isNaN(configuredTtlSec))
      ? configuredTtlSec
      : (expires_in || 43200);

    // Calcular timestamp de expiración en milisegundos
    const expiresAt = Date.now() + (ttlSeconds * 1000);

    tokenMemoryCache = {
      accessToken: access_token,
      tokenType: token_type || "Bearer",
      expiresAt,
    };

    logger.info(`Token obtenido exitosamente. Expira en ${ttlSeconds} segundos (Timestamp: ${new Date(expiresAt).toISOString()})`);
    return access_token;
  } catch (error) {
    logger.error("Error al obtener token de autenticación OMS:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Obtiene el token de acceso actual en memoria, o solicita uno nuevo si ha expirado
 * @param {boolean} forceRefresh Si es true, fuerza la obtención de un nuevo token
 * @returns {Promise<string>} Token de acceso válido
 */
const getAccessToken = async (forceRefresh = false) => {
  const now = Date.now();
  // Margen de seguridad de 60 segundos antes de expirar
  const isExpired = !tokenMemoryCache.accessToken || now >= (tokenMemoryCache.expiresAt - 60000);

  if (forceRefresh || isExpired) {
    if (pendingTokenPromise) {
      logger.info("Ya hay una solicitud de token en curso. Reutilizando promesa en vuelo...");
      return await pendingTokenPromise;
    }

    logger.info("El token en memoria ha expirado o no existe. Solicitando uno nuevo...");
    pendingTokenPromise = requestNewToken()
      .finally(() => {
        pendingTokenPromise = null;
      });

    return await pendingTokenPromise;
  }

  logger.info("Reutilizando token de autenticación OMS en memoria");
  return tokenMemoryCache.accessToken;
};

/**
 * Retorna el estado actual de la caché en memoria (para monitoreo o depuración)
 */
const getTokenCacheStatus = () => ({
  hasToken: Boolean(tokenMemoryCache.accessToken),
  tokenType: tokenMemoryCache.tokenType,
  expiresAt: tokenMemoryCache.expiresAt ? new Date(tokenMemoryCache.expiresAt).toISOString() : null,
  isExpired: Date.now() >= (tokenMemoryCache.expiresAt - 60000),
});

/**
 * Limpia la caché en memoria
 */
const clearTokenCache = () => {
  pendingTokenPromise = null;
  tokenMemoryCache = {
    accessToken: null,
    tokenType: "Bearer",
    expiresAt: 0,
  };
};


module.exports = {
  getAccessToken,
  requestNewToken,
  getTokenCacheStatus,
  clearTokenCache,
};
