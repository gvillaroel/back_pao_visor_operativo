exports.validaJSONVacio = (objeto) =>
  Object.keys(objeto).length === 0 && objeto.constructor === Object;
