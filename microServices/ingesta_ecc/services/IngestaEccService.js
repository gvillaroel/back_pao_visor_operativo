const db = require('../config/db');
const Schema = require('../models/init-models');

const { Ecc } = Schema.default(db);
const { SaveEcc } = require('../repositories/IngestaEccRepository');

/**
 * Obtiene los valores del body y los prepara para el repositorio de  insercion a cxcec
 * @param {*} body
 */
exports.SaveIngestaEccService = async (body) => {
  try {
    const ingestaEccInstance = await GetInstance(body);
    return await SaveEcc(ingestaEccInstance);
  } catch (error) {
    console.error('Error saving IngestaEcc:', error);
    throw error;
  }
};

const GetInstance = async (body) => {
  const instance = new Ecc({
    zvadrep: body.zvadrep,
    noSolicitudDev: body.noSolicitudDev,
    remision: body.remision,
    fechaDevAplicada: body.fechaDevAplicada,
    fechaCompra: body.fechaCompra,
    fechaSolicitudDev: body.fechaSolicitudDev,
    usuario: body.usuario,
    tdaOrigen: body.tdaOrigen,
    tdaReconocimiento: body.tdaReconocimiento,
    evento: body.evento,
    sku: body.sku,
    descripcion: body.descripcion,
    piezas: body.piezas,
    importe: body.importe,
    estatusRenglon: body.estatusRenglon,
    recogido: body.recogido,
    descEstatus: body.descEstatus,
    comentario: body.comentario,
    bolDev: body.bolDev,
    causa: body.causa,
    descTipoDev: body.descTipoDev,
  });

  return instance.dataValues;
};
