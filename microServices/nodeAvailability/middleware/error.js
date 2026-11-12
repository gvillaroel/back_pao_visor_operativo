const log4js = require("log4js");
const logger = log4js.getLogger("ErrorHandler");

const errorHandler = (err, req, res, next) => {
  logger.error("Error no controlado:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    success: false,
    code: statusCode,
    message,
    data: []
  });
};

module.exports = errorHandler;
