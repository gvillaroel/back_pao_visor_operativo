/*
* Se define la clase Error Response la cual se utilizara como plantilla
* para generar objetos JSON con la estructura de una respuesta del API que se consulte
*/
class ResponseData extends Error {
  /*
  * se define el constructor con os siguientes parametros
  * @message mensaje que se desea regresar al consultar el API
  * de acuerdo a lo resuelto internamente por la logica del servicio
  * @statusCode se define con un numero de acuerdo al catalogo de codigos HTTP
  *  dependiendo del resultado del API
  * @data el valor de este parametro sera igual al resultado de la consulta
  * con los filtros relacionados obtenidos
  */
  constructor(message, statusCode, data) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

module.exports = ResponseData;
