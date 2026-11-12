const express = require('express');

const router = express.Router();
// const { authJWT } = require('../middleware/jwt');

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

const { saveIngestaEcc, pruebaEcc } = require('../controllers/IngestaEccController');
const { apikeys } = require('../middleware/apikeys');

// Describe the route entrypoints

router.route('/').post(generarRateLimit('INGESTAECC'), apikeys, saveIngestaEcc);
module.exports = router;
