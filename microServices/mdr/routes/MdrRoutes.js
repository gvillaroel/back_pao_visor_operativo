const express = require('express');
const { apikeys } = require('../middleware/apikeys');

const router = express.Router();
// const { authJWT } = require('../middleware/jwt');

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

const { getMdr } = require('../controllers/MdrController');

// Describe the route entrypoints
router.route('/id/:event').get(apikeys, generarRateLimit('MDRCONSULTA'), getMdr);

module.exports = router;
