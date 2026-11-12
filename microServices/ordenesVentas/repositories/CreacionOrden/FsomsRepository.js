const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { Fsoms } = Schema.default(db.sequelize);

/**
  * Crea un registro de  Fechas soms  en BD.
  *
  * @param Fsoms {json}
  * @return regresa el registro de la fecha en BD
  */
exports.CreateFsoms = async (json) => {
  if (json.length > 0) {
    const newDates = await Fsoms.bulkCreate(
      json,
    );
    return newDates;
  }
  return "no data";
};

/**
  * Busca el registro m'as actual de fecha soms
  *
  * @param OrderNo {string}
  * @param Sku {string}
  * @return regresa el registro de la fecha en BD
  */
exports.GetOneFsoms = async (OrdenN, Sku) => {
  console.log("------------> ORDEN SKU", OrdenN, Sku)
  const fechasoms = await Fsoms.findOne({
    where: {
      orden: OrdenN,
      sku: Sku,
    },
    order: [['fecha_creacion', 'DESC']],
    limit: 1,
    raw: true,
  });
  return fechasoms;
};
