const express = require('express');

const router = express.Router();
const { authJWT } = require('../middleware/jwt');

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

// Load Methods from Controller
const {
  getTokens,
  getTokenbyId,
  getTokenbyToken,
  createToken,
  updateToken,
  disableToken,
} = require('../controllers/TokenUrlMagicController');

// Describe the route entrypoints
router
  .route('/')
  .get(authJWT, generarRateLimit('TOKEN_URL'), getTokens)
  .post(authJWT, generarRateLimit('TOKEN_URL'), createToken);
// .post(protect, validateCreate(), createUsuario);

router
  .route('/string/:token')
  .get(authJWT, generarRateLimit('TOKEN_URL'), getTokenbyToken);

router
  .route('/:id')
  .get(authJWT, generarRateLimit('TOKEN_URL'), getTokenbyId)
  .put(authJWT, generarRateLimit('TOKEN_URL'), updateToken)
  .delete(authJWT, generarRateLimit('TOKEN_URL'), disableToken);

module.exports = router;
