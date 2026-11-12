const log4js = require("log4js");
const { getAccessToken } = require("../services/AuthService");

const logger = log4js.getLogger("InjectTokenMiddleware");

/**
 * Middleware para inyectar el token de autenticación a las peticiones del microservicio
 */
const injectToken = async (req, res, next) => {
  try {
    const token = await getAccessToken();
    req.omsToken = token;
    req.headers.authorization = `Bearer ${token}`;
    next();
  } catch (error) {
    logger.error("Fallo al inyectar token de autenticación OMS:", error.response?.data || error.message);
    res.status(502).json({
      success: false,
      code: 502,
      message: "No fue posible autenticar con el servicio de OMS (error al obtener token)",
      data: [],
      error: error.message || error,
    });
  }
};

module.exports = injectToken;
