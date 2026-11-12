const express = require('express');

const router = express.Router();
// const { authJWT } = require('../middleware/jwt');

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

const { saveCxcec } = require('../controllers/CxcecController');
const { apikeys } = require('../middleware/apikeys')
// Describe the route entrypoints
router.route('/').post(generarRateLimit('CXCEC'), apikeys, saveCxcec);

module.exports = router;
