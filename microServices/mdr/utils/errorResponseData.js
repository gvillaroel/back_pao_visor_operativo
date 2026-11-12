/*
 * Se define la clase Error Response la cual se utilizara como plantilla
 * para generar objetos JSON con la estructura de una respuesta del API que se consulte
 */
class ErrorResponse extends Error {
  /*
   * se define el constructor con os siguientes parametros
   * @message mensaje que se desea regresar al consultar el API
   * de acuerdo a lo resuelto internamente por la logica del servicio
   * @statusCode se define con un numero de acuerdo al catalogo de codigos HTTP
   *  dependiendo del resultado del API
   * @data el valor de este parametro sera igual al resultado de la consulta
   * con los filtros relacionados obtenidos
   * @internalCode es el valor del codigo definido dentro del catalogo de mensajes
   *  identificado de la aplicacion
   */
  constructor(message, statusCode, data, internalCode = 9999) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.internalCode = internalCode;
  }
}

module.exports = ErrorResponse;
