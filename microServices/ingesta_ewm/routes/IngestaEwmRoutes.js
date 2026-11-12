const express = require('express');

const router = express.Router();
// const { authJWT } = require('../middleware/jwt');

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

const { saveIngestaEwm } = require('../controllers/IngestaEwmController');
const { apikeys } = require('../middleware/apikeys');
// Describe the route entrypoints

router.route('/').post(generarRateLimit('INGESTAEWM'), apikeys, saveIngestaEwm);
module.exports = router;
