const log4js = require("log4js");
const db = require("../config/db");
const Schema = require("../models/init-models");
const configlog4 = require("../log4js.json");
const { CreateIntegracion } = require("./IntegracionesRepository");

const { S4Hanna } = Schema.default(db);
log4js.configure(configlog4);

const logger = log4js.getLogger("S4HannaController");

const fixData = (data) => {
  let result = {};
  Object.keys(data).forEach((key) => {
    if (
        data[key] !== undefined
      && data[key] !== null
      && data[key] !== " "
      && data[key] !== "null"
      && data[key] !== "undefined"
    ) {
      result[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
    }
  });
  return result;
};

function LimpiaLetras(datos) {
  const datoSinLetras = datos.replace(/[a-zA-Z]/g, "");
  return datoSinLetras;
}

/**
 * Guarda los valores previamente tratados en el servicio
 * @param {*} body
 */
exports.SaveS4Hanna = async (body) => {
  try {
    body.data.forEach(async (element) => {
      // eslint-disable-next-line no-param-reassign
      element.sku = LimpiaLetras(element.sku);
      const [instance, created] = await S4Hanna.findOrCreate({
        where: {
          remision: element.remision,
          sku: LimpiaLetras(element.sku),
        },
        defaults: fixData(element),
      });
      if (!created) {
        instance.update(element);
      }
    });
    return 1;
  } catch (error) {
    logger.error(error);
    // Almacenamos el error en la tabla Integraciones
    try {
      const NumeroOrden = body.data[0].remision;
      const integracion = {
        Sistema: "S4HANNA-Error",
        JSONSistema: body.data,
        OrderHeaderKey: NumeroOrden,
        MessageType:
          `Error guardando data de s4hanna. ${error.message}`.substring(0, 100),
      };
      await CreateIntegracion(integracion);
    } catch (err) {
      logger.error(err);
    }
    return null;
  }
};
