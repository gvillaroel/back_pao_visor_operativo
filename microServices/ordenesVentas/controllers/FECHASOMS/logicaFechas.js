const log4js = require("log4js");
const config = require("../../log4js.json");
const moment = require("moment");
const { GetOneFsoms } = require("../../repositories/CreacionOrden/FsomsRepository");

log4js.configure(config);
const logger = log4js.getLogger("LOGICA FECHA SOMS");

/**
  * Recibe la linea y orderno.
  *
  * @param linea {JSON} linea para sacar las fechas
  * @param OrderN {STRING} cadena con el numero de orden
  */
async function ValidarFechaSoms(linea, OrderN) {
  logger.info("En metodo validar logica SOMS");
  // Busca si hay fecha para la orden seleccionada
  const FechaSoms = await GetOneFsoms(OrderN, linea.ItemID);
  const ExtnCustomerDeliveryDate_previo = linea.ExtnCustomerDeliveryDate
  let ValidarBackOrder = false;

  // si BackOrderedQuantity vs el OriginalQty,
  // son iguales entonces la linea completa está en backordered
  if (linea.BackOrderedQuantity != null && linea.OriginalOrderedQty != null) {
    if (linea.BackOrderedQuantity === linea.OriginalOrderedQty) {
      ValidarBackOrder = true;
    }
  }

  if (FechaSoms != null) {
    const fecha_soms_formateada = new Date(FechaSoms.fecha_soms);
    if (FechaSoms.fecha_soms === '' || FechaSoms.fecha_soms === null) {
      linea.ExtnCustomerDeliveryDate = null;
      linea.ReqDeliveryDate = null;
      linea.ReqDeliveryDate2 = null;
    } else if (linea.StatusLine.toLowerCase() === 'sin disponiblidad' || ValidarBackOrder) {
      linea.ExtnCustomerDeliveryDate = fecha_soms_formateada;
    }

    if (fecha_soms_formateada > ExtnCustomerDeliveryDate_previo) {
      logger.info("aplica escenario 10");
      linea.ExtnCustomerDeliveryDate = fecha_soms_formateada;
    }
    // Escenario 12 si llega vacia la fecha de soms se debe mostrar "a su arribo"
  } else {
    linea.ExtnCustomerDeliveryDate = linea.ExtnCustomerDeliveryDate === null ? "" : new Date(moment(new Date(linea.ExtnCustomerDeliveryDate)).format("YYYY-MM-DD HH:mm:ss UTC"));
  }

  return linea;
}
module.exports = { ValidarFechaSoms };
