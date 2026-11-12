/**
 * Modelo para representar y procesar mensajes de actualización de inventario (IV)
 * provenientes de Google Cloud Pub/Sub.
 */
class IVAvailabilityMessage {
  /**
   * @param {Object} data Objeto parseado del mensaje Pub/Sub
   */
  constructor(data = {}) {
    Object.assign(this, data || {});
  }

  /**
   * Parsea de forma segura un mensaje en formato Buffer, string u Objeto
   * @param {Buffer|string|Object} rawData Datos crudos del mensaje
   * @returns {IVAvailabilityMessage} Instancia del mensaje
   * @throws {Error} Si el JSON es inválido o no es un objeto
   */
  static parse(rawData) {
    if (!rawData) {
      throw new Error("El contenido del mensaje está vacío");
    }

    let parsed;
    if (Buffer.isBuffer(rawData) || typeof rawData === "string") {
      try {
        parsed = JSON.parse(rawData.toString("utf-8"));
      } catch (err) {
        throw new Error(`JSON inválido en el payload del mensaje: ${err.message}`);
      }
    } else if (typeof rawData === "object") {
      parsed = rawData;
    } else {
      throw new Error("Tipo de dato del payload no soportado");
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("El mensaje debe contener un objeto JSON raíz válido");
    }

    return new IVAvailabilityMessage(parsed);
  }

  /**
   * Valida la estructura y campos obligatorios de negocio del mensaje
   * @throws {Error} Si la estructura no cumple con los requerimientos
   */
  validate() {
    // if (!this.id || this.id === undefined || this.id === null || String(this.id).trim() === "") {
    //   throw new Error(`El mensaje no contiene un 'id' válido. Mensaje ID: ${this.id}`);
    // }

    if (!this.data || typeof this.data !== "object") {
      throw new Error(`El mensaje no contiene un objeto 'data' válido. Mensaje ID: ${this.id}`);
    }

    const { data } = this;

    if (!data.productId || data.productId === undefined || data.productId === null || String(data.productId).trim() === "") {
      throw new Error(`El mensaje no contiene un 'productId' válido en 'data'. Mensaje ID: ${this.id}`);
    }

    if (!data.shipNode || data.shipNode === undefined || data.shipNode === null || String(data.shipNode).trim() === "") {
      throw new Error(`El mensaje no contiene un 'shipNode' válido en 'data'. Mensaje ID: ${this.id}`);
    }

    if (!data.currentAvailability || typeof data.currentAvailability !== "object") {
      throw new Error(`El mensaje no contiene un 'currentAvailability' válido en 'data'. Mensaje ID: ${this.id}`);
    }

    if (!data.currentAvailability.toTs || typeof data.currentAvailability.toTs !== "string"
        || !Number.isFinite(Date.parse(data.currentAvailability.toTs))) {
      throw new Error(`El campo 'toTs' en 'currentAvailability' debe ser una cadena de fecha válida. Mensaje ID: ${this.id}`);
    }

    if (!data.currentAvailability.availableQuantity || typeof data.currentAvailability.availableQuantity !== "number"
        || !Number.isFinite(data.currentAvailability.availableQuantity)) {
      throw new Error(`El campo 'availableQuantity' en 'currentAvailability' debe ser un número válido. Mensaje ID: ${this.id}`);
    }

    return true;
  }

  /**
   * Transforma el mensaje al formato requerido para auditoría en logs:
   *   {
   *     "messageId": "12345",
   *     "productId": "Liv_SL_Item001",
   *     "node": "28",
   *     "availableQuantity": 2000.0,
   *     "toTs": "2026-11-02T00:00:00.000Z"
   *   }
   * @returns {Object} Objeto estructurado para auditoría
   */
  toAuditFormat() {
    return {
        messageId: this.id,
        productId: this.data?.productId,
        node: this.data?.shipNode,
        availableQuantity: this.data?.currentAvailability?.availableQuantity,
        toTs: this.data?.currentAvailability?.toTs,
    };
  }
}

module.exports = IVAvailabilityMessage;
