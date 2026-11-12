/* eslint-disable array-callback-return */
const log4js = require("log4js");
const asyncHandler = require("../middleware/async");

const configlog4 = require("../log4js.json");
const { FetchGestorByID } = require("../repositories/GestorRepository");

log4js.configure(configlog4);
const logger = log4js.getLogger("GestorController");

exports.getGestor = asyncHandler(async (req, res) => {
  logger.info("En metodo getGestor");

  try {
    const guia = req.params.guia;

    const gestor = await FetchGestorByID(guia.trim());
    if (gestor !== null) {
      res.send({ code: 200, data: gestor, message: "success" });
    } else {
      res.send({ code: 200, data: {}, message: "success" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: [], error });
  }

  // successResponse(
  //   res,
  //   { info: 'Informacion de Gestor, saludos a Acorde chiquito' },
  //   'Info OK'
  // );
});
