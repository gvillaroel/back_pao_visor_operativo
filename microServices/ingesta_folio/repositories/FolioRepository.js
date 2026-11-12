const db = require('../config/db');
const Schema = require('../models/init-models');

const { OrdenVenta, Integraciones, Linea } = Schema.default(db);

exports.CreateIntegracion = async (integraciones) => {
  return Integraciones.create(integraciones);
};

exports.UpdateIntegracion = async (integraciones) => {
  const save = await Integraciones.update(
    {
      error: integraciones.error,
    },
    {
      where: {
        IDIntegracion: integraciones.IDIntegracion,
      },
      attributes: {
        exclude: ["create_time", "update_time", "fcreacion", "factualizacion"],
      },
    }
  );
  return save;
};

exports.ConsultaOrdenVenta = async (OrderNo, SKU) => {
  if (OrderNo !== null && SKU !== null) {
    const fetched = await Linea.findOne({
      where: {
        ItemID: SKU,
      },
      include: [
        {
          model: OrdenVenta,
          as: "OrdenVenta",
          required: true,
          where: { OrderNo: OrderNo },
          attributes: [],
        },
      ],
      attributes: ['OrderHeaderKey', 'OrderLineKey'],
      raw: true,
    });
    return fetched;
  }
  return null;
};

exports.UpdateOrdenVenta = async (data) => {
  const save = await Linea.update(
    {
      WorkOrderID: data.WorkOrderID,
      WorkOrderLink: data.WorkOrderLink,
    },
    {
      where: {
        ItemID: data.sku,
      },
      attributes: {
        exclude: ["create_time", "update_time", "fcreacion", "factualizacion"],
      },
    }
  );
  return save;
};
