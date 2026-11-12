const express = require('express');

const router = express.Router();
// const { authJWT } = require('../middleware/jwt');

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

const { getCxcec } = require('../controllers/CxcecController');
const { apikeys } = require('../middleware/apikeys')
// Describe the route entrypoints
router.route('/getCxcec').get(generarRateLimit('CXCEC'), apikeys, getCxcec);

module.exports = router;
