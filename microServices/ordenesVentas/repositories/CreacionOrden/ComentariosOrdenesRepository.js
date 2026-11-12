/* eslint-disable consistent-return */
const log4js = require("log4js");
const { Op } = require("sequelize");
const db = require("../../config/db");
const Schema = require("../../models/init-models");

const { ComentariosOrdenes } = Schema.default(db.sequelize);

const limit = 10;
const config = require("../../log4js.json");

log4js.configure(config);

// @desc  Get all rows
exports.FetchAll = async (query) => {
  const options = {
    order: [["fecha_creacion", query?.order ? query?.order : "DESC"]],
    include: [
      {
        association: "historico_comentario",
        attributes: ["id", "responsable", "valor_anterior", "fecha_creacion"],
        where: {
          valor_anterior: { [Op.not]: null },
        },
        order: [["fecha_creacion", "DESC"]],
        limit: 1,
      },
    ],
  };

  if (query?.orden) {
    options.where = { orden: query?.orden };
  }

  if (query.page) {
    options.limit = query.pagesize ?? limit;
    options.offset = (query.page - 1) * options.limit;
  }

  const data = await ComentariosOrdenes.findAndCountAll(options);
  return { registros: data.rows, total: data.count };
};

exports.Create = async (comentario, params) => {
  const response = await ComentariosOrdenes.create(comentario, params || {});
  return response;
};

exports.findById = async (id, params = {}) => {
  const response = await ComentariosOrdenes.findByPk(id, params);
  return response;
};

/** @desc  Update Comment */
exports.Update = async (comentario, id_comentario, params = {}) => {
  const vComentario = comentario;
  const commentUpdated = await ComentariosOrdenes.update(vComentario, {
    where: { id_comentario },
    ...params,
  });
  return commentUpdated;
};
