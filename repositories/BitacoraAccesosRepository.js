/* eslint-disable consistent-return */
const log4js = require("log4js");
const db = require("../config/db");
const Schema = require("../models/init-models");

const { BitacoraAccesos } = Schema.default(db);

const config = require("../log4js.json");

log4js.configure(config);
const logger = log4js.getLogger("BitacoraAccesosRepository");

/**
  * Consulta la bitacora de accesos con paginación.
  *
  * @param page {integer} pagina en la que se encuentra.
  * @param pagesize {integer} tamaño de la paginacion.
  * @return rows Array regresa el array de accesos.
  */
exports.FetchAll = async (page, pagesize) => {
  const rows = await BitacoraAccesos.findAll({
    order: [["update_time", "DESC"]],
    limit: pagesize,
    offset: ((page - 1) * pagesize),
    raw:true
  });
  return rows;
};

/**
  * Consulta el total de accesos a la app.
  *
  * @return total El total de accesos a la app.
  */
exports.FetchCount = async () => {
  const total = await BitacoraAccesos.count();
  return total;
};

/**
  * Consulta un acceso en particular buscando por id.
  *
  * @param id {integer} corresponde al id del acceso.
  * @return rows Array regresa el acceso buscado.
  */
exports.FetchOne = async (id) => {
  const row = await BitacoraAccesos.findOne({
    where: { id_bitacora: id },
    raw:true
  });

  return row;
};

/**
  * Se crea un nuevo registro de acceso.
  *
  * @param butacora {JSON} contiene la informacion de acceso.
  * @return newBitacora JSON confirmacion de que se ingreso el registro.
  */
exports.Create = async (bitacora) => {
  try {
    const newBitacora = await BitacoraAccesos.create(
      bitacora,
    );
    return newBitacora;
  } catch (err) {
    logger.error(err);
  }
};
