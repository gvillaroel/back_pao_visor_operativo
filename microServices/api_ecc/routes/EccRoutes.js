const express = require('express');

const router = express.Router();

// @desc Importing the methods from the utils repository;
const { generarRateLimit } = require('../utils/rate_limiter');

const { getEcc } = require('../controllers/EccController');
const { apikeys } = require('../middleware/apikeys');

// Describe the route entrypoints
router.route('/:remision/:sku').get(generarRateLimit('ECC'), apikeys, getEcc);

module.exports = router;
