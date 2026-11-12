const db = require("../config/db");
const Schema = require("../models/init-models");

const { S4Hanna } = Schema.default(db);
const { SaveS4Hanna } = require("../repositories/S4HannaRepository");

/**
 * Obtiene los valores del body y los prepara para el repositorio de insercion a S4Hanna
 * @param {*} body
 */
exports.SaveS4HannaService = async (body) => {
  const {
    id_hanna,
    remision,
    fechaCompra,
    fechaSolDev,
    fechaDevApl,
    usrAsesorSap,
    usrAdmonSap,
    tiendaOrigen,
    role_id,
    tiendaRecon,
    evento,
    sku,
    piezas,
    precioUnit,
    descuento,
    totalCobro,
    estatus,
    recogido,
    descEstatus,
    descMotivo,
    comentarios,
    boletaDev,
    idDevPaypal,
    idVtaPaypal,
    descCausa,
    descDCausa,
    descTipoDev,
    entEfecTda,
    refOpenPay,
    carrComp,
    bonMerc,
    promBonif
  } = body;
  try {
    const s4HannaInstance = new S4Hanna({
      id_hanna,
      remision,
      fechaCompra,
      fechaSolDev,
      fechaDevApl,
      usrAsesorSap,
      usrAdmonSap,
      tiendaOrigen,
      role_id,
      tiendaRecon,
      evento,
      sku,
      piezas,
      precioUnit,
      descuento,
      totalCobro,
      estatus,
      recogido,
      descEstatus,
      descMotivo,
      comentarios,
      boletaDev,
      idDevPaypal,
      idVtaPaypal,
      descCausa,
      descDCausa,
      descTipoDev,
      entEfecTda,
      refOpenPay,
      carrComp,
      bonMerc,
      promBonif
    });
    return await SaveS4Hanna(s4HannaInstance.dataValues);
  } catch (error) {
    console.error("Error saving Cxcec:", error);
    throw error;
  }
};
