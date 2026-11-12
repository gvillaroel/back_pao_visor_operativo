const rateLimit = require("express-rate-limit");

const log4js = require("log4js");
const config = require("../log4js.json");

log4js.configure(config);
const logger = log4js.getLogger("OrdenVentaController");

function obtenerMinutos(minutos) {
  return minutos * 60 * 1000;
}

exports.generarRateLimit = (servicio) => {
  const tiempo = process.env[`RATE_LIT_MINS_${servicio}`] ? process.env[`RATE_LIT_MINS_${servicio}`] : process.env.RATE_LIT_MINS;
  const frecuencia = process.env[`RATE_LIT_TIMES_${servicio}`] ? process.env[`RATE_LIT_TIMES_${servicio}`] : process.env.RATE_LIT_TIMES;
  const mensaje = `${process.env.RATE_LIT_MENSJ} ${tiempo} ${process.env.RATE_LIT_DESC_TIME}`;

  const limiter = rateLimit({
    windowMs: obtenerMinutos(tiempo), // tiempo
    max: frecuencia, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: mensaje,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      // Respuesta en formato JSON
      if (Object.prototype.hasOwnProperty.call(req, "decodedToken")) {
        logger.info("Demasiadas solicitudes: ", req.decodedToken.email);
      } else {
        logger.info("Demasiadas solicitudes: ", req.body.user);
      }
      res.status(429).json({ code: 429, error: mensaje });
    },
  });

  return limiter;
};
