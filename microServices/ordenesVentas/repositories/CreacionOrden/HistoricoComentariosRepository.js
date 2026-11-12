/* eslint-disable indent, consistent-return */

const { Op } = require("sequelize");
const Schema = require("../../models/init-models");
const db = require("../../config/db");

const limit = 10;
const { HistoricoComentarios } = Schema.default(db.sequelize);

exports.CreateHistoricoComentario = async (historico, params = {}) => {
  const newHistorico = await HistoricoComentarios.create(historico, params);
  return newHistorico;
};

exports.GetAllHistoricoComentarios = async (query) => {
  const { order = "DESC", orderBy = "fecha_creacion" } = query;
  const options = {
    order: [[orderBy, order]],
    where: {
      executed: true,
    },
  };

  if (query.page) {
    options.limit = query.pagesize ?? limit;
    options.offset = (query.page - 1) * options.limit;
  }

  if (String(query?.orden).trim()) {
    options.where = { orden: query?.orden };
  }

  if (query?.fecha) {
    options.where.fecha_creacion = {
      [Op.between]: [
        new Date(query.fecha).setHours(0, 0, 0),
        new Date(query.fecha).setHours(23, 59, 59),
      ],
    };
  }

  if (query.editor) {
    const user = query.editor.split("@")[0];
    // Si es correo solo buscar por el valor antes del arroba
    options.where.responsable = {
      [Op.iLike]: `%${user}%`,
    };
  }

  if (query?.incluirNoCulminados && query?.incluirNoCulminados === "true") {
    options.where.executed = {
      [Op.or]: [true, false],
    };
  }

  const data = await HistoricoComentarios.findAndCountAll(options);
  return { registros: data.rows || [], total: data.count || 0 };
};
