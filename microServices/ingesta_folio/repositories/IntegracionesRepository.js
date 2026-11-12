const sequelize = require('sequelize');
const { Op } = require('sequelize');
const db = require('../config/db');
const Schema = require('../models/init-models');

const { Integraciones } = Schema.default(db);

/**
 * Crea una integración en BD.
 *
 * @param integracion {JSON} Información de una nueva integración
 * @return newIntegracion Regresa el registro de la integración en BD
 */
exports.CreateIntegracion = async (integracion) => {
  return Integraciones.create(integracion);
};

/**
 * Consulta una integración en BD.
 * @param orderNo {String} Número de orden de venta
 * @return ordenventa Regresa el registro de la integración en BD
 */
exports.ConsultaIntegracionByOrdenVenta = async (
  orderHeaderKey,
  documentType
) => {
  const result = await Integraciones.findOne({
    where: {
      OrderHeaderKey: orderHeaderKey,
      [Op.or]: [
        { Sistema: 'INT201' },
        { Sistema: 'INTAPIGEE2010' }
      ],
      error: null
    },
    order: [['FchCreacion', 'DESC']],
  });

  if (result && result.JSONSistema && result.JSONSistema.Order && result.JSONSistema.Order.DocumentType === documentType) {
    return result;
  } else {
    return null;
  }
};
