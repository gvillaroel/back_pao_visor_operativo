const express = require('express');

const router = express.Router();

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

const { getEwm,
    getEwmV2
} = require('../controllers/EwmController');
const { apikeys } = require('../middleware/apikeys');

// Describe the route entrypoints
router.route('/').get(generarRateLimit('EWM'), apikeys, getEwm);
router.route('/v2').post(generarRateLimit('EWM'), apikeys, getEwmV2);
module.exports = router;
