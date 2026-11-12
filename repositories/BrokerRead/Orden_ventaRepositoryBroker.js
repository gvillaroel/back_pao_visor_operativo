/* eslint-disable no-param-reassign */
const log4js = require("log4js");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const { BrokerReadPool } = require("../../config/brokerReadPool");
const Schema = require("../../models/init-models");
const { esCadenaFechaValida, obtenerListaStatusShipment } = require("../../utils/utils");
const config = require("../../log4js.json");
const {
  FetchOneClienteNuevoEmailIfExist,
} = require("../CreacionOrden/ClienteNuevoRepository");

const {
 OrdenVenta,
} = Schema.default(BrokerReadPool);
const { OrdenVentaVW } = Schema.default(BrokerReadPool);

log4js.configure(config);
const logger = log4js.getLogger("Orden Venta Repository");

exports.ObtenerTimeZone = async () => {
  const resultado = await sequelize.query(
    "SELECT current_setting('TIMEZONE') AS zona_horaria;",
    {
      type: QueryTypes.SELECT,
    },
  );
  return resultado;
};

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposOrdenVentaBroker = async () => {
  const campos = OrdenVenta.getAttributes();
  const camposSinPK = Object.keys(campos).filter((key) => campos[key].primaryKey === undefined);
  return camposSinPK;
};


/**
  * Verifica que exista una orden en BD buscando por numero de orden.
  *
  * @param OrdenNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrdenNumbyIdClienteBroker = async (IDCliente) => {
  const orden = await OrdenVenta.findOne({
    where: {
      IDCliente,
      OrderNo: {
        [Op.notLike]: "Y%",
      },
    },
    raw: true,
  });
  return orden;
};

/**
  * Verifica que exista una orden en BD buscando por numero de orden.
  *
  * @param OrdenNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrdenNumBroker = async (ordenNum) => {
  const orden = await OrdenVenta.findOne({
    where: { OrderNo: ordenNum },
    raw: true,
  });
  return orden;
};

/**
  * Verifica que exista una orden en BD buscando por OrderHeaderKey.
  *
  * @param OrdenNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrdenBroker = async (OrderHeaderKey) => {
  const orden = await OrdenVenta.findOne({
    where: { OrderHeaderKey },
    attributes: {},
    raw: true,
  });
  return orden;
};

/**
  * Verifica que exista una orden en BD buscando por OrderHeaderKey.
  *
  * @param OrdenNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrderNoOriginalBroker = async (OrderNoOriginal) => {
  const orden = await OrdenVenta.findAll({
    where: { OrderNoOriginal },
    attributes: {},
    raw: true,
  });
  return orden;
};

/**
  * Verifica que exista una orden en BD buscando por numero de orden.
  *
  * @param OrderNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrdenByOrdenNoBroker = async (OrderNo) => {
  const orden = await OrdenVenta.findOne({
    where: { OrderNo },
    attributes: {},
    raw: true,
  });
  return orden;
};

exports.FetchCustomerInfoByOrderNoBroker = async (OrderNo) => {
  const result = await OrdenVenta.findOne({
    attributes: ["IDCliente"],
    where: { OrderNo },
    raw: true,
  });

  if (result) {
    const clienteNuevo = await FetchOneClienteNuevoEmailIfExist(result.IDCliente);
    return clienteNuevo;
  }
  return null;
};

/**
  * Verifica que exista una orden en BD buscando por numero de orden
  * y empresa indicando si es liverpool o suburbia
  *
  * @param OrderNo {string} Numero de la orden para poder hacer la busqueda
  * @param Empresa {string} Valor de indica si es Liverpool o Suburbia
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrdenByOrdenNoEmpBroker = async (OrderNo, Empresa) => {
  const orden = await OrdenVenta.findOne({
    where: {
      OrderNo,
      [Op.iLike]: Sequelize.literal(`LOWER("EnterpriseCode") LIKE LOWER('%${Empresa}%')`),
    },
    attributes: {},
    raw: true,
  });
  return orden;
};

/**
  * Regresa todas las ordenes en BD
  *
  * @return ordenes regresa un arreglo con todas las ordenes en BD
  */
exports.FetchAllOrdenesBroker = async () => {
  const ordenes = await OrdenVenta.findAll({
    raw: true,
  });
  return ordenes;
};

/**
  * Regresa todas las ordenes en BD
  *
  * @return ordenes regresa un arreglo con todas las ordenes en BD
  */
exports.FetchAllOrdenesValidarSKUCantidadBroker = async () => {
  const ordenes = await OrdenVenta.findAll({
    where: {
      [Op.and]: [
        sequelize.literal("TO_CHAR(\"OrderDate\", 'YYYY-MM-DD') < '2024-03-20'"),
        {
          [Op.or]: [
            {
              statusSKUCantidad: {
                [Op.notLike]: "%igual%",
              },
            },
            sequelize.where(sequelize.col("statusSKUCantidad"), null),
          ],
        },
        /* {
          "OrderNo": '9772811999'
        } */
      ],
    },
    limit: 200,
    raw: true,
  });
  return ordenes;
};
