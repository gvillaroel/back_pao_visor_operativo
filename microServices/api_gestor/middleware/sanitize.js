/**
 * Aplica la función de sanitize de manera recursiva a objetos y arrays.
 *
 * @param obj {Object|Array|String|Number|null} El objeto o valor a sanitizar.
 * @param sanitizeFn {Function} La función de sanitize proporcionada (req.sanitize).
 * @return {Object|Array|String|Number|null} El objeto o valor sanitizado.
 */
function applySanitize(obj, sanitizeFn) {
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      // Si es un array, recorrer cada elemento y aplicar la sanitización
      return obj.map((element) => applySanitize(element, sanitizeFn));
    }
    // Si es un objeto, recorrer cada propiedad y aplicar la sanitización
    const sanitizedObj = {};
    Object.entries(obj).forEach(([key]) => {
      sanitizedObj[key] = applySanitize(obj[key], sanitizeFn);
    });
    return sanitizedObj;
  }
  if (typeof obj === "string" && obj !== "") {
    return sanitizeFn(obj);
  }

  // Otros tipos de datos (boolean, null, etc. y enteros = 0) no se modifican
  return obj;
}

/**
 * Middleware para sanitizar req.params y req.body aplicando la función de sanitize
 *  de manera recursiva.
 *
 * @param req {Object} El objeto de solicitud (request).
 * @return {Object} El objeto de solicitud (request) con req.params y req.body sanitizados.
 */
module.exports.sanitize = (req) => {
  req.params = applySanitize(req.params, req.sanitize);
  req.body = applySanitize(req.body, req.sanitize);
  req.file = applySanitize(req.file, req.sanitize);
  req.decodedToken = applySanitize(req.decodedToken, req.sanitize);
  return req;
};
