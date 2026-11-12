const express = require('express');

const router = express.Router();
// const { authJWT } = require('../middleware/jwt');

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

const { getS4Hanna } = require('../controllers/S4HannaController');

// Describe the route entrypoints
router
  .route('/getS4Hanna/:id_s4hanna')
  .get(generarRateLimit('S4HANNA'), getS4Hanna);

module.exports = router;
