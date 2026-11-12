/* eslint-disable array-callback-return */
const log4js = require('log4js');
const asyncHandler = require('../middleware/async');

const configLog4 = require('../log4js.json');
const {
  FetchSiebelByStrOrdenVenta,
  FetchExternalSiebelByStrOrdenVenta,
} = require('../repositories/SiebelRepository');

log4js.configure(configLog4);
const logger = log4js.getLogger('SiebelController');
const successResponse = require('../middleware/successResponse');

exports.getSiebel = asyncHandler(async (req, res) => {
  logger.info('En metodo getSiebel');

  try {
    const { strOrdenVenta, strEmailContacto, strTelContacto } = req.query;

    const siebel = await FetchSiebelByStrOrdenVenta(
      strOrdenVenta,
      strEmailContacto,
      strTelContacto
    );

    const responseObject = (siebel) => {
      return {
        LVPQuerySR_Output: {
          Error_spcCode: 0,
          Error_spcMessage: {},
          ListOfLvpsratg: {
            LvpServiceRequestAtg: siebel ? [siebel] : [],
          },
        },
      };
    };

    if (siebel !== null) {
      successResponse(res, responseObject(siebel));
    } else {
      const externalResponse = await FetchExternalSiebelByStrOrdenVenta(
        strOrdenVenta
      );
      successResponse(res, responseObject(externalResponse[0]));
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send({ code: 500, data: {}, error });
  }
});
