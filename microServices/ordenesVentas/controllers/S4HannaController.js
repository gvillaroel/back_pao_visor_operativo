/* eslint-disable array-callback-return */
const log4js = require('log4js');
const asyncHandler = require('../middleware/async');

const configlog4 = require('../log4js.json');
const { FetchS4HannaByID } = require('../repositories/S4HannaRepository');

log4js.configure(configlog4);
const logger = log4js.getLogger('S4HannaController');

exports.getS4Hanna = asyncHandler(async (req, res) => {
  logger.info('En metodo getS4Hanna');

  try {
    const id_frecuencia = req.params.id_s4hanna;

    const s4Hanna = await FetchS4HannaByID(id_frecuencia);
    if (s4Hanna !== null) {
      res.send({ code: 200, data: s4Hanna, message: 'success' });
    } else {
      res.send({ code: 200, data: {}, message: 'success' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: [], error });
  }

  // successResponse(
  //   res,
  //   { info: "Informacion de S4Hanna, saludos a Acorde chiquito" },
  //   "Info OK"
  // );
});
