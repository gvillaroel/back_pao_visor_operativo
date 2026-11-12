/**
 * Sanitiza los parámetros de entrada del request
 * @param {Object} req Request express
 * @returns {Object} Request sanitizado
 */
const sanitize = (req) => {
  const sanitizedReq = req;
  if (sanitizedReq.body && typeof sanitizedReq.body === "object") {
    Object.keys(sanitizedReq.body).forEach((key) => {
      if (typeof sanitizedReq.body[key] === "string" && req.sanitize) {
        sanitizedReq.body[key] = req.sanitize(sanitizedReq.body[key]);
      }
    });
  }
  return sanitizedReq;
};

module.exports = { sanitize };
