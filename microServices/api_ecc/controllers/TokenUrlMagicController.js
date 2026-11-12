/* eslint-disable consistent-return */
const log4js = require('log4js');
const ErrorResponse = require('../utils/errorResponse');
const successResponse = require('../middleware/successResponse');
const asyncHandler = require('../middleware/async');
const {
  validationErrorsEnhancer,
} = require('../utils/ValidationErrorsEnhancer');

const config = require('../log4js.json');

log4js.configure(config);
const logger = log4js.getLogger('TokenUrlMagicController');

// @desc Importing the methods from the model repository;
const {
  FetchAll,
  FetchOne,
  FetchOnebyId,
  FetchOnebyToken,
  Create,
  Update,
  disableToken,
} = require('../repositories/TokenUrlMagicRepository');

// @desc  Get all Tokens
// @route GET /api/v1/tokens
// @access Public
exports.getTokens = asyncHandler(async (req, res, next) => {
  try {
    logger.info('En metodo getTokens');

    const regs = await FetchAll();
    successResponse(res, regs, 'Tokens Fetched');
  } catch (error) {
    logger.error(error);
    return next(new ErrorResponse(error, 500));
  }
});

// @desc  Get One Token
// @route GET /api/v1/catalogo/token/:id
// @access Public for now
exports.getTokenbyId = asyncHandler(async (req, res, next) => {
  try {
    const vreq = req;
    logger.info('En metodo getTokenbyId');

    const reg = await FetchOnebyId(vreq.params.id);

    if (!reg) {
      return next(new ErrorResponse('Token not found', 404, 2001));
    }
    successResponse(res, reg, 'Token Fetched');
  } catch (error) {
    logger.error(error);
    return next(new ErrorResponse(error, 500));
  }
});

// @desc  Get One Token
// @route GET /api/v1/catalogo/token/:token
// @access Public for now
exports.getTokenbyToken = asyncHandler(async (req, res, next) => {
  try {
    const vreq = req;
    logger.error('En metodo getTokenbyToken');

    const reg = await FetchOnebyToken(vreq.params.token);

    if (!reg) {
      return next(new ErrorResponse('Token not found', 404, 2001));
    }
    successResponse(res, reg, 'Token Fetched');
  } catch (error) {
    logger.error(error);
    return next(new ErrorResponse(error, 500));
  }
});

// @desc  Create Tokens
// @route POST /api/v1/tokens
// @access Public for now
exports.createToken = asyncHandler(async (req, res, next) => {
  try {
    const vreq = req;
    logger.info('En metodo createToken');

    // Using the ValidatorErrorsEnhancer, the param uses the req from the middleware used
    // on the route file.
    const errors = validationErrorsEnhancer(req);

    // If there is errors It will be sent from here and the resource won't be created.
    if (errors !== undefined) {
      return next(new ErrorResponse(errors, 422));
    }

    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (Object.prototype.hasOwnProperty.call(vreq.body, 'correo')) {
      logger.info('tiene valor correo');
      if (vreq.body.correo === '' || !vreq.body.correo.match(emailFormat)) {
        logger.info('correo invalido');
        return next(new ErrorResponse('formato de correo invalido!!!', 422));
      }

      logger.info('correo valido');
    }

    const newReg = await Create(vreq.body);
    const regFromRepo = await FetchOne(newReg);

    successResponse(res, regFromRepo, 'Token Created', 201);
  } catch (error) {
    logger.error(error);
    return next(new ErrorResponse(error, 500));
  }
});

// @desc  Update Tokens
// @route PUT /api/v1/token/:id
// @access Public for now
exports.updateToken = asyncHandler(async (req, res, next) => {
  try {
    const vreq = req;
    logger.info('En metodo updateToken');

    const { id } = vreq.params;
    const reg = await FetchOnebyId(id);
    if (!reg) {
      return next(new ErrorResponse('Token not found', 404));
    }

    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (Object.prototype.hasOwnProperty.call(vreq.body, 'correo')) {
      if (vreq.body.correo === '' || !vreq.body.correo.match(emailFormat)) {
        return next(new ErrorResponse('formato de correo invalido!!!', 422));
      }
    }

    await Update(vreq.body, id);

    const regFromRepo = await FetchOnebyId(id);
    successResponse(res, regFromRepo, 'Token Updated', 200);
  } catch (error) {
    logger.error(error);
    return next(new ErrorResponse(error, 500));
  }
});

// @desc  Logical delete Token
// @route DELETE /api/v1/token/:id
// @access Public for now
exports.disableToken = asyncHandler(async (req, res, next) => {
  try {
    const vreq = req;
    logger.info('En metodo disableToken');

    const { id } = vreq.params;
    const reg = await FetchOnebyId(id);
    if (!reg) {
      return next(new ErrorResponse('Token not found', 404));
    }
    await disableToken(id);

    const regFromRepo = await FetchOnebyId(id);
    successResponse(
      res,
      regFromRepo,
      // {},
      'Token Disable',
      200,
    );
  } catch (error) {
    logger.error(error);
    return next(new ErrorResponse(error, 500));
  }
});
